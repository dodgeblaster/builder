import { useEffect, useState } from 'react'
import { Output } from '../components/CloudformationOutput'
import { Node } from '../components/Node'
import { Layout } from '../components/Layout'
import { CanvasButtons } from '../pageComponents/CanvasButtons'
import { CanvasRenderEdges } from '../pageComponents/CanvasRenderEdges'
import { CanvasEditPane } from '../pageComponents/CanvasEditPane'

const initNodeState = {
    1234: {
        id: 1234,
        resourceType: 'Lambda',
        resourceCFName: 'AWS::SERVERLESS::FUNCTION',
        name: 'My Lambda',
        type: 'start',
        x: 80,
        y: 80
    },
    1235: {
        id: 1235,
        resourceType: 'DynamoDB',
        resourceCFName: 'AWS::DYNAMODB::TABLE',
        name: 'My Table',
        type: 'end',
        x: 80 * 5,
        y: 80
    }
}

const initEdgeState = {
    1234: 1235
}

export default function Home() {
    const [showApp, setShowApp] = useState(false)

    // Wait until after client-side hydration to show
    useEffect(() => {
        setShowApp(true)
    }, [])

    const [nodes, setNodes] = useState(initNodeState)
    const [edges, setEdges] = useState(initEdgeState)

    const [connectorState, setConnectorState] = useState({ start: null, end: null })
    const [editing, setEditing] = useState(false)
    const [showOutput, setShowOutput] = useState(false)
    const [editMode, setEditMode] = useState(true)
    const [snapOn, setSnapOn] = useState(false)

    const addLambda = () => {
        const number = Object.keys(nodes).length / 2 + 1
        const randomId = Date.now().toString()
        setNodes((nodes) => ({
            ...nodes,
            [randomId]: {
                id: randomId,
                resourceType: 'Lambda',
                resourceCFName: 'AWS::SERVERLESS::FUNCTION',
                name: 'My Lambda',
                type: 'start',
                x: 96 + 30 * number,
                y: 80 * number + 16
            }
        }))
    }

    const addDb = () => {
        const number = Object.keys(nodes).length / 2 + 1
        const randomId = Date.now().toString()
        setNodes((nodes) => ({
            ...nodes,
            [randomId]: {
                id: randomId,
                resourceType: 'DynamoDB',
                resourceCFName: 'AWS::DYNAMODB::TABLE',
                name: 'My Table',
                type: 'end',
                x: 80 + 30 * number,
                y: 80 * number
            }
        }))
    }

    const addApi = () => {
        const number = Object.keys(nodes).length / 2 + 1
        const randomId = Date.now().toString()
        setNodes((nodes) => ({
            ...nodes,
            [randomId]: {
                id: randomId,
                resourceType: 'ApiGateway',
                resourceCFName: 'AWS::SERVERLESS::HTTPAPI',
                name: 'My Endpoint',
                type: 'start',
                x: 80 + 30 * number,
                y: 80 * number
            }
        }))
    }
    const addEventRule = () => {
        const number = Object.keys(nodes).length / 2 + 1
        const randomId = Date.now().toString()
        setNodes((nodes) => ({
            ...nodes,
            [randomId]: {
                id: randomId,
                resourceType: 'EventBridge',
                resourceCFName: 'AWS::EVENTS::RULE',
                name: 'My Rule',
                type: 'start',
                x: 80 + 30 * number,
                y: 80 * number
            }
        }))
    }

    const addCognitoUserPool = () => {
        const number = Object.keys(nodes).length / 2 + 1
        const randomId = Date.now().toString()
        setNodes((nodes) => ({
            ...nodes,
            [randomId]: {
                id: randomId,
                resourceType: 'CognitoUserPool',
                resourceCFName: 'AWS::COGNITO::USERPOOL',
                name: 'My User Pool',
                type: 'start',
                x: 80 + 30 * number,
                y: 80 * number
            }
        }))
    }

    const RenderNodes = () => {
        return Object.keys(nodes).map((id) => {
            if (nodes[id].nodeType === 'vector') {
                return (
                    <Node
                        snapOn={snapOn}
                        editMode={editMode}
                        id={id}
                        nodeType={'vector'}
                        x={nodes[id].x}
                        y={nodes[id].y}
                        set={(x, y) => {
                            setNodes({
                                ...nodes,
                                [id]: {
                                    ...nodes[id],
                                    x,
                                    y
                                }
                            })
                        }}
                    />
                )
            }
            return (
                <Node
                    snapOn={snapOn}
                    flashing={connectorState.start === id}
                    resourceType={nodes[id].resourceType}
                    resourceCFName={nodes[id].resourceCFName}
                    type={nodes[id].type}
                    id={id}
                    name={nodes[id].name}
                    color="bg-gray-600"
                    onEditClick={() => setEditing(id)}
                    setStartConnector={() => {
                        if (connectorState.start === id) {
                            setConnectorState({
                                start: null,
                                end: null
                            })
                        } else {
                            setConnectorState({
                                start: id,
                                end: null
                            })
                        }
                    }}
                    setEndConnector={() => {
                        if (!connectorState.start) {
                            return
                        }

                        /**
                         * Find all Edges and Nodes to Remove
                         */
                        let listOfEdgesToRemove = []
                        let listOfNodesToRemove = []

                        let count = 0
                        if (edges[connectorState.start]) {
                            let currentEdge = connectorState.start
                            let currentNode = nodes[currentEdge]

                            while (currentNode && (currentNode.nodeType || count === 0) && count < 100) {
                                listOfEdgesToRemove.push(currentEdge)
                                if (count > 0) {
                                    listOfNodesToRemove.push(currentNode.id)
                                }

                                currentNode = nodes[edges[currentEdge]]
                                if (currentNode) {
                                    currentEdge = edges[currentEdge]
                                }
                                count++
                            }
                        }

                        /**
                         * Filter edges out that need to be removed
                         */
                        let newEdges = Object.keys(edges).reduce((acc, k) => {
                            const isStaying = !listOfEdgesToRemove.find((x) => x === k)
                            if (isStaying) {
                                acc[k] = edges[k]
                            }
                            return acc
                        }, {})

                        /**
                         * Filter nodes out that need to be removed
                         */
                        let newNodes = Object.keys(nodes).reduce((acc, k) => {
                            const isStaying = !listOfNodesToRemove.find((x) => x === k)
                            if (isStaying) {
                                acc[k] = nodes[k]
                            }
                            return acc
                        }, {})

                        /**
                         * Set new state
                         */
                        setEdges({
                            ...newEdges,
                            [connectorState.start]: id
                        })
                        setNodes({
                            ...newNodes
                        })
                        setConnectorState({
                            start: null,
                            end: null
                        })
                    }}
                    set={(x, y) => {
                        setNodes({
                            ...nodes,
                            [id]: {
                                ...nodes[id],
                                x,
                                y
                            }
                        })
                    }}
                    x={nodes[id].x}
                    y={nodes[id].y}
                />
            )
        })
    }

    if (!showApp) {
        return 'Loading...'
    }
    return (
        <Layout
            output={() => {
                return showOutput ? <Output nodes={nodes} edges={edges} close={() => setShowOutput(false)} /> : ''
            }}
        >
            <CanvasRenderEdges
                edges={edges}
                nodes={nodes}
                setEdges={setEdges}
                setNodes={setNodes}
                editMode={editMode}
            />
            <RenderNodes />
            <CanvasButtons
                addLambda={addLambda}
                addDb={addDb}
                addApi={addApi}
                addEventRule={addEventRule}
                addCognitoUserPool={addCognitoUserPool}
                editMode={editMode}
                setEditMode={setEditMode}
                showOutput={showOutput}
                setShowOutput={setShowOutput}
                snapOn={snapOn}
                setSnapOn={setSnapOn}
            />

            <CanvasEditPane
                initName={editing ? nodes[editing].name : ''}
                save={(id, name) => {
                    setNodes((nodes) => ({
                        ...nodes,
                        [id]: {
                            ...nodes[id],
                            name
                        }
                    }))
                    setEditing(false)
                }}
                id={editing}
                open={editing}
                close={() => setEditing(false)}
            />
        </Layout>
    )
}
