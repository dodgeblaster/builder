export default (name, stage, permissions) => {
    const code = `exports.handler = async (e) => "placeholder code" `
    const basePermissions = [
        {
            Action: ['logs:CreateLogStream'],
            Resource: [
                {
                    'Fn::Sub': [
                        `arn:aws:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/${name}-${stage}:*`,
                        {}
                    ]
                }
            ],
            Effect: 'Allow'
        },
        {
            Action: ['logs:PutLogEvents'],
            Resource: [
                {
                    'Fn::Sub': [
                        `arn:aws:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/${name}-${stage}:*:*`,
                        {}
                    ]
                }
            ],
            Effect: 'Allow'
        }
    ]

    const combinedPermissions = permissions ? [...basePermissions, ...permissions] : basePermissions

    return {
        Resources: {
            [`Lambda${name}${stage}LogGroup`]: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: `/aws/lambda/${name}-${stage}`
                }
            },

            [`Lambda${name}${stage}`]: {
                Type: 'AWS::Lambda::Function',
                Properties: {
                    Code: {
                        ZipFile: code
                    },
                    FunctionName: `${name}-${stage}`,
                    Handler: 'index.handler',
                    MemorySize: 1024,
                    Role: {
                        'Fn::GetAtt': [`Lambda${name}${stage}Role`, 'Arn']
                    },
                    Runtime: 'nodejs14.x',
                    Timeout: 6
                },
                DependsOn: [`Lambda${name}${stage}LogGroup`]
            },

            [`Lambda${name}${stage}Role`]: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['lambda.amazonaws.com']
                                },
                                Action: ['sts:AssumeRole']
                            }
                        ]
                    },
                    Policies: [
                        {
                            PolicyName: `Lambda${name}${stage}RolePolicy`,
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: combinedPermissions
                            }
                        }
                    ],
                    Path: '/',
                    RoleName: `Lambda${name}${stage}Role`
                }
            }
        },
        Outputs: {}
    }
}
