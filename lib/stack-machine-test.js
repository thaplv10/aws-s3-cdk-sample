"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackMachineTest = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
class StackMachineTest extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
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
exports.StackMachineTest = StackMachineTest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stbWFjaGluZS10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhY2stbWFjaGluZS10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUVoRCxtQ0FBa0M7QUFDbEMsaURBQWdEO0FBQ2hELDZEQUE0RDtBQUM1RCxxREFBb0Q7QUFFcEQsTUFBYSxnQkFBaUIsU0FBUSxtQkFBSztJQUd2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3hELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDZDQUE2QztRQUM3QyxNQUFNLG9CQUFvQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDM0UsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1lBQ3JDLE9BQU8sRUFBRSw4QkFBOEI7WUFDdkMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNuQyxDQUFDLENBQUM7UUFDSCxrREFBa0Q7UUFDbEQsTUFBTSw4QkFBOEIsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLG1DQUFtQyxFQUFFO1lBQ3JHLGNBQWMsRUFBRSxvQkFBb0I7WUFDcEMsVUFBVSxFQUFFLFdBQVc7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gscUZBQXFGO1FBQ3JGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN2RSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDckMsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ25DLENBQUMsQ0FBQztRQUdILGdGQUFnRjtRQUNoRixNQUFNLHFCQUFxQixHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsdUNBQXVDLEVBQUU7WUFDaEcsY0FBYyxFQUFFLG1CQUFtQjtZQUNuQyxTQUFTLEVBQUUsR0FBRztZQUNkLFVBQVUsRUFBRSxHQUFHO1NBQ2xCLENBQUMsQ0FBQztRQUNILDhGQUE4RjtRQUM5RixNQUFNLHVCQUF1QixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDeEUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1lBQ3JDLE9BQU8sRUFBRSxxQkFBcUI7WUFDOUIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNuQyxDQUFDLENBQUM7UUFDSCx5RkFBeUY7UUFDekYsTUFBTSx5QkFBeUIsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLDZDQUE2QyxFQUFFO1lBQzFHLGNBQWMsRUFBRSx1QkFBdUI7WUFDdkMsU0FBUyxFQUFFLEdBQUc7WUFDZCxVQUFVLEVBQUUsR0FBRztTQUNsQixDQUFDLENBQUM7UUFFSCw0QkFBNEI7UUFDNUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDcEQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZELENBQUMsQ0FBQztRQUVILCtCQUErQjtRQUMvQixNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQzthQUNyRCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyx5QkFBeUIsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFLHFCQUFxQixDQUFDO2FBQ2xILElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLHlCQUF5QixFQUFFLGlCQUFpQixDQUFDLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNwSyxnQ0FBZ0M7UUFDaEMsTUFBTSxVQUFVLEdBQUcsOEJBQThCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV2Rix5QkFBeUI7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0RCxVQUFVO1lBQ1YsZ0JBQWdCLEVBQUUsMEJBQTBCO1lBQzVDLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDbkMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBbEVELDRDQWtFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIHRhc2tzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJ1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJ1xuXG5leHBvcnQgY2xhc3MgU3RhY2tNYWNoaW5lVGVzdCBleHRlbmRzIFN0YWNrIHtcbiAgICBwdWJsaWMgTWFjaGluZTogc2ZuLlN0YXRlTWFjaGluZTtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxuICAgICAgICBjb25zdCBnZW5lcmF0ZVJhbmRvbU51bWJlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0dlbmVyYXRlUmFuZG9tTnVtYmVyJywge1xuICAgICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxuICAgICAgICAgICAgaGFuZGxlcjogJ2dlbmVyYXRlUmFuZG9tTnVtYmVyLmhhbmRsZXInLFxuICAgICAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMylcbiAgICAgICAgfSk7XG4gICAgICAgIC8vTGFtYmRhIGludm9jYXRpb24gZm9yIGdlbmVyYXRpbmcgYSByYW5kb20gbnVtYmVyXG4gICAgICAgIGNvbnN0IGdlbmVyYXRlUmFuZG9tTnVtYmVySW52b2NhdGlvbiA9IG5ldyB0YXNrcy5MYW1iZGFJbnZva2UodGhpcywgJ0dlbmVyYXRlIHJhbmRvbSBudW1iZXIgaW52b2NhdGlvbicsIHtcbiAgICAgICAgICAgIGxhbWJkYUZ1bmN0aW9uOiBnZW5lcmF0ZVJhbmRvbU51bWJlcixcbiAgICAgICAgICAgIG91dHB1dFBhdGg6ICckLlBheWxvYWQnLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTGFtYmRhIGZ1bmN0aW9uIGNhbGxlZCBpZiB0aGUgZ2VuZXJhdGVkIG51bWJlciBpcyBncmVhdGVyIHRoYW4gdGhlIGV4cGVjdGVkIG51bWJlclxuICAgICAgICBjb25zdCBmdW5jdGlvbkdyZWF0ZXJUaGFuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcIk51bWJlckdyZWF0ZXJUaGFuXCIsIHtcbiAgICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEnKSxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdncmVhdGVyLmhhbmRsZXInLFxuICAgICAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICAgIC8vIExhbWJkYSBpbnZvY2F0aW9uIGlmIHRoZSBnZW5lcmF0ZWQgbnVtYmVyIGlzIGdyZWF0ZXIgdGhhbiB0aGUgZXhwZWN0ZWQgbnVtYmVyXG4gICAgICAgIGNvbnN0IGdyZWF0ZXJUaGFuSW52b2NhdGlvbiA9IG5ldyB0YXNrcy5MYW1iZGFJbnZva2UodGhpcywgJ0dldCBOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIGludm9jYXRpb24nLCB7XG4gICAgICAgICAgICBsYW1iZGFGdW5jdGlvbjogZnVuY3Rpb25HcmVhdGVyVGhhbixcbiAgICAgICAgICAgIGlucHV0UGF0aDogJyQnLFxuICAgICAgICAgICAgb3V0cHV0UGF0aDogJyQnLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTGFtYmRhIGZ1bmN0aW9uIGNhbGxlZCBpZiB0aGUgZ2VuZXJhdGVkIG51bWJlciBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIGV4cGVjdGVkIG51bWJlclxuICAgICAgICBjb25zdCBmdW5jdGlvbkxlc3NUaGFuT3JFcXVhbCA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJOdW1iZXJMZXNzVGhhblwiLCB7XG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhJyksXG4gICAgICAgICAgICBoYW5kbGVyOiAnbGVzc09yRXF1YWwuaGFuZGxlcicsXG4gICAgICAgICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzKVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTGFtYmRhIGludm9jYXRpb24gaWYgdGhlIGdlbmVyYXRlZCBudW1iZXIgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBleHBlY3RlZCBudW1iZXJcbiAgICAgICAgY29uc3QgbGVzc1RoYW5PckVxdWFsSW52b2NhdGlvbiA9IG5ldyB0YXNrcy5MYW1iZGFJbnZva2UodGhpcywgJ0dldCBOdW1iZXIgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIGludm9jYXRpb24nLCB7XG4gICAgICAgICAgICBsYW1iZGFGdW5jdGlvbjogZnVuY3Rpb25MZXNzVGhhbk9yRXF1YWwsXG4gICAgICAgICAgICBpbnB1dFBhdGg6ICckJyxcbiAgICAgICAgICAgIG91dHB1dFBhdGg6ICckJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9Db25kaXRpb24gdG8gd2FpdCAxIHNlY29uZFxuICAgICAgICBjb25zdCB3YWl0MVNlY29uZCA9IG5ldyBzZm4uV2FpdCh0aGlzLCBcIldhaXQgMSBTZWNvbmRcIiwge1xuICAgICAgICAgICAgdGltZTogc2ZuLldhaXRUaW1lLmR1cmF0aW9uKGNkay5EdXJhdGlvbi5zZWNvbmRzKDEpKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9DaG9pY2UgY29uZGl0aW9uIGZvciB3b3JrZmxvd1xuICAgICAgICBjb25zdCBudW1iZXJDaG9pY2UgPSBuZXcgc2ZuLkNob2ljZSh0aGlzLCAnSm9iIENvbXBsZXRlPycpXG4gICAgICAgICAgICAud2hlbihzZm4uQ29uZGl0aW9uLm51bWJlckdyZWF0ZXJUaGFuSnNvblBhdGgoJyQuZ2VuZXJhdGVkUmFuZG9tTnVtYmVyJywgJyQubnVtYmVyVG9DaGVjaycpLCBncmVhdGVyVGhhbkludm9jYXRpb24pXG4gICAgICAgICAgICAud2hlbihzZm4uQ29uZGl0aW9uLm51bWJlckxlc3NUaGFuRXF1YWxzSnNvblBhdGgoJyQuZ2VuZXJhdGVkUmFuZG9tTnVtYmVyJywgJyQubnVtYmVyVG9DaGVjaycpLCBsZXNzVGhhbk9yRXF1YWxJbnZvY2F0aW9uKS5vdGhlcndpc2UobGVzc1RoYW5PckVxdWFsSW52b2NhdGlvbik7XG4gICAgICAgIC8vQ3JlYXRlIHRoZSB3b3JrZmxvdyBkZWZpbml0aW9uXG4gICAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBnZW5lcmF0ZVJhbmRvbU51bWJlckludm9jYXRpb24ubmV4dCh3YWl0MVNlY29uZCkubmV4dChudW1iZXJDaG9pY2UpO1xuXG4gICAgICAgIC8vQ3JlYXRlIHRoZSBzdGF0ZW1hY2hpbmVcbiAgICAgICAgdGhpcy5NYWNoaW5lID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUodGhpcywgXCJTdGF0ZU1hY2hpbmVcIiwge1xuICAgICAgICAgICAgZGVmaW5pdGlvbixcbiAgICAgICAgICAgIHN0YXRlTWFjaGluZU5hbWU6ICdyYW5kb21OdW1iZXJTdGF0ZU1hY2hpbmUnLFxuICAgICAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==