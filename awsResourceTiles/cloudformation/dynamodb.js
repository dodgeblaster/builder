export default (name, stage) => {
    return {
        Resources: {
            [`${name}${stage}Table`]: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: name + stage,
                    AttributeDefinitions: [
                        {
                            AttributeName: 'pk',
                            AttributeType: 'S'
                        },
                        {
                            AttributeName: 'sk',
                            AttributeType: 'S'
                        },
                        {
                            AttributeName: 'pk2',
                            AttributeType: 'S'
                        },
                        {
                            AttributeName: 'pk3',
                            AttributeType: 'S'
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'pk',
                            KeyType: 'HASH'
                        },
                        {
                            AttributeName: 'sk',
                            KeyType: 'RANGE'
                        }
                    ],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: 'pk2',
                            KeySchema: [
                                {
                                    AttributeName: 'pk2',
                                    KeyType: 'HASH'
                                },
                                {
                                    AttributeName: 'sk',
                                    KeyType: 'RANGE'
                                }
                            ],
                            Projection: {
                                ProjectionType: 'ALL'
                            }
                        },
                        {
                            IndexName: 'pk3',
                            KeySchema: [
                                {
                                    AttributeName: 'pk3',
                                    KeyType: 'HASH'
                                },
                                {
                                    AttributeName: 'sk',
                                    KeyType: 'RANGE'
                                }
                            ],
                            Projection: {
                                ProjectionType: 'ALL'
                            }
                        }
                    ],
                    BillingMode: 'PAY_PER_REQUEST'
                }
            }
        },
        Outputs: {}
    }
}
