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

test("Lambda Has Environment Variables", () => {
  const stack = new cdk.Stack();

  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "lambda.handler",
      code: lambda.Code.inline("test"),
    }),
  });

  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          DOWNSTREAM_FUNCTION_NAME: { Ref: "TestFunction22AD90FC" }, // 一旦テスト実行して実際の値を確認して書く。
          HITS_TABLE_NAME: { Ref: "MyTestConstructHits24A357F0" },
        },
      },
    })
  );
});

test("read capacity can be configured", () => {
  const stack = new cdk.Stack();

  expect(() => {
    new HitCounter(stack, "MyTestConstruct", {
      downstream: new lambda.Function(stack, "TestFunction", {
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: "lambda.handler",
        code: lambda.Code.inline("test"),
      }),
      readCapacity: 3,
    });
  }).toThrowError(/readCapacity must be greater than 5 and less than 20/);
});
