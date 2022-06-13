import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks'
import * as sfn from 'aws-cdk-lib/aws-stepfunctions'

export class StackMachineTest extends Stack {
    public Machine: sfn.StateMachine;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        
        // The code that defines your stack goes here
        const generateRandomNumber = new lambda.Function(this, 'GenerateRandomNumber', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'generateRandomNumber.handler',
            timeout: cdk.Duration.seconds(3)
        });
        //Lambda invocation for generating a random number
        const generateRandomNumberInvocation = new tasks.LambdaInvoke(this, 'Generate random number invocation', {
            lambdaFunction: generateRandomNumber,
            outputPath: '$.Payload',
        });
        // Lambda function called if the generated number is greater than the expected number
        const functionGreaterThan = new lambda.Function(this, "NumberGreaterThan", {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'greater.handler',
            timeout: cdk.Duration.seconds(3)
        });

        
        // Lambda invocation if the generated number is greater than the expected number
        const greaterThanInvocation = new tasks.LambdaInvoke(this, 'Get Number is greater than invocation', {
            lambdaFunction: functionGreaterThan,
            inputPath: '$',
            outputPath: '$',
        });
        // Lambda function called if the generated number is less than or equal to the expected number
        const functionLessThanOrEqual = new lambda.Function(this, "NumberLessThan", {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'lessOrEqual.handler',
            timeout: cdk.Duration.seconds(3)
        });
        // Lambda invocation if the generated number is less than or equal to the expected number
        const lessThanOrEqualInvocation = new tasks.LambdaInvoke(this, 'Get Number is less than or equal invocation', {
            lambdaFunction: functionLessThanOrEqual,
            inputPath: '$',
            outputPath: '$',
        });

        //Condition to wait 1 second
        const wait1Second = new sfn.Wait(this, "Wait 1 Second", {
            time: sfn.WaitTime.duration(cdk.Duration.seconds(1)),
        });

        //Choice condition for workflow
        const numberChoice = new sfn.Choice(this, 'Job Complete?')
            .when(sfn.Condition.numberGreaterThanJsonPath('$.generatedRandomNumber', '$.numberToCheck'), greaterThanInvocation)
            .when(sfn.Condition.numberLessThanEqualsJsonPath('$.generatedRandomNumber', '$.numberToCheck'), lessThanOrEqualInvocation).otherwise(lessThanOrEqualInvocation);
        //Create the workflow definition
        const definition = generateRandomNumberInvocation.next(wait1Second).next(numberChoice);

        //Create the statemachine
        this.Machine = new sfn.StateMachine(this, "StateMachine", {
            definition,
            stateMachineName: 'randomNumberStateMachine',
            timeout: cdk.Duration.minutes(5),
        });
    }
}