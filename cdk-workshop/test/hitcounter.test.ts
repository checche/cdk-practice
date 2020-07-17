import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import cdk = require("@aws-cdk/core");
import { HitCounter } from "../lib/hitcounter";
import * as lambda from "@aws-cdk/aws-lambda";

test("DynamoDB Table Created", () => {
  const stack = new cdk.Stack();

  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "lambda.handler",
      code: lambda.Code.inline("test"),
    }),
  });

  expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
});
