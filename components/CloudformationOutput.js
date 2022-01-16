import resourceDefinitions from '../awsResourceTiles'

function makeDynamoDbPermission(name) {
    const stage = 'dev'
    return {
        Action: [
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem'
        ],
        Effect: 'Allow',
        Resource: [
            {
                'Fn::Sub': [
                    `arn:aws:dynamodb:\${AWS::Region}:\${AWS::AccountId}:table/${name.replace(/\s+/g, '')}${stage}:*`,
                    {}
                ]
            },
            {
                'Fn::Sub': [
                    `arn:aws:dynamodb:\${AWS::Region}:\${AWS::AccountId}:table/${name.replace(/\s+/g, '')}${stage}`,
                    {}
                ]
            }
        ]
    }
}

function findEndingNode(nodes, edges, initStartId, initEndId) {
    let endNodeId = initEndId
    let startNode = nodes[initStartId]
    let endNode = nodes[initEndId]

    while (endNode && endNode.nodeType === 'vector') {
        const newStartNode = nodes[endNodeId]
        const newEndNodeId = edges[endNodeId]
        const newEndNode = nodes[newEndNodeId]

        startNode = newStartNode
        endNode = newEndNode
        endNodeId = newEndNodeId
    }

    return endNode
}

function findPermissionsToAdd(edges, nodes) {
    let permissionsToAdd = {}
    Object.keys(edges).forEach((id) => {
        if (!id.startsWith('vector')) {
            const startId = id
            const endId = edges[id]
            const startNode = nodes[startId]
            const endNode = findEndingNode(nodes, edges, startId, endId)

            /**
             * Only handling Lambda -> DynamoDB permissions for this POC
             */
            if (startNode.resourceType === 'Lambda' && endNode.resourceType === 'DynamoDB') {
                if (!permissionsToAdd[startId]) {
                    permissionsToAdd[startId] = []
                }

                permissionsToAdd[startId] = [...permissionsToAdd[startId], makeDynamoDbPermission(endNode.name)]
            }
        }
    })
    return permissionsToAdd
}

function createCloudFormation(nodes, permissionsToAdd) {
    let output = {
        Resources: {},
        Outputs: {}
    }

    Object.keys(nodes).forEach((id) => {
        if (!id.startsWith('vector')) {
            const node = nodes[id]
            const resourceType = node.resourceType
            const name = node.name.replace(/\s+/g, '')
            const generateCloudFormation = resourceDefinitions[resourceType].generateCloudFormation
            let result = {
                Resources: {},
                Outputs: {}
            }

            if (node.resourceType === 'Lambda') {
                let permissions = permissionsToAdd[id] || []
                result = generateCloudFormation(name, 'dev', permissions)
            }

            if (node.resourceType === 'DynamoDB') {
                result = generateCloudFormation(name, 'dev')
            }

            output = {
                Resources: {
                    ...output.Resources,
                    ...result.Resources
                },
                Outputs: {
                    ...output.Outputs,
                    ...result.Outputs
                }
            }
        }
    })

    return output
}

export function Output(props) {
    const nodes = props.nodes
    const edges = props.edges

    const permissionsToAdd = findPermissionsToAdd(edges, nodes)
    const output = createCloudFormation(nodes, permissionsToAdd)
    const code = JSON.stringify(output, null, 2)

    return (
        <pre className="absolute shadow-lg text-left top-0 w-2/3 mx-auto bg-gray-800 rounded text-gray-100 top-10 h-2/3 z-10 overflow-y-scroll">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-700">CloudFormation</div>
            <div className="px-4 py-2 ">
                <code
                    style={{
                        fontSize: 12
                    }}
                >
                    {code}
                </code>
            </div>
        </pre>
    )
}
