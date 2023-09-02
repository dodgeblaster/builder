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
        connectors: {
            start: true,
            end: true
        },
        type: 'start',
        x: 80,
        y: 80
    },
    1235: {
        id: 1235,
        resourceType: 'DynamoDB',
        resourceCFName: 'AWS::DYNAMODB::TABLE',
        name: 'My Table',
        connectors: {
            start: true
        },
        type: 'end',
        x: 80 * 5,
        y: 80
    }
}

/**
 * This instead needs to be
 * const edges = {
 *      "start_123#end_123": true,
 *      "start_123#end_124": true
 * }
 *
 * so we can have many to many relationships
 */
const initEdgeState = {
    //1234: 1235,
    '1234#1235': true
}

export default function Home() {
    const [showApp, setShowApp] = useState(false)

    const [panPosition, setPanPosition] = useState({ x: 0, y: 0, z: 0 })
    // Wait until after client-side hydration to show
    useEffect(() => {
        setShowApp(true)
    }, [])

    const [nodes, setNodes] = useState(initNodeState)
    const [edges, setEdges] = useState(initEdgeState)
    const [inProgressLine, setInProgressLine] = useState({
        active: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    })
    const [viewNodes, setViewNodes] = useState({})
    const [viewOn, setViewOn] = useState(false)

    const [connectorState, setConnectorState] = useState({
        start: null,
        end: null
    })
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
                connectors: {
                    start: true,
                    end: true
                },
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
                connectors: {
                    start: true
                },
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
                connectors: {
                    end: true
                },
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
                connectors: {
                    end: true
                },
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
                connectors: {
                    end: true
                },
                type: 'start',
                x: 80 + 30 * number,
                y: 80 * number
            }
        }))
    }

    let nodesToRender = viewOn ? viewNodes : nodes
    const RenderNodes = (props) => {
        return Object.keys(nodesToRender).map((id) => {
            if (nodesToRender[id].nodeType === 'vector') {
                return (
                    <Node
                        snapOn={snapOn}
                        editMode={editMode}
                        id={id}
                        nodeType={'vector'}
                        x={nodesToRender[id].x - props.viewport.x}
                        y={nodesToRender[id].y - props.viewport.y}
                        z={props.viewport.z}
                        set={(x, y) => {
                            setNodes({
                                ...nodesToRender,
                                [id]: {
                                    ...nodesToRender[id],
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
                    resourceType={nodesToRender[id].resourceType}
                    resourceCFName={nodesToRender[id].resourceCFName}
                    connectors={nodes[id].connectors}
                    type={nodes[id].type}
                    id={id}
                    name={nodes[id].name}
                    color="bg-gray-600"
                    onEditClick={() => setEditing(id)}
                    inProgressLine={inProgressLine}
                    setInProgressLine={(x) => {
                        setInProgressLine(x)
                    }}
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
                            let currentNode = nodesToRender[currentEdge]

                            while (
                                currentNode &&
                                (currentNode.nodeType || count === 0) &&
                                count < 100
                            ) {
                                listOfEdgesToRemove.push(currentEdge)
                                if (count > 0) {
                                    listOfNodesToRemove.push(currentNode.id)
                                }

                                currentNode = nodesToRender[edges[currentEdge]]
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
                            const isStaying = !listOfEdgesToRemove.find(
                                (x) => x === k
                            )
                            if (isStaying) {
                                acc[k] = edges[k]
                            }
                            return acc
                        }, {})

                        /**
                         * Filter nodes out that need to be removed
                         */
                        let newNodes = Object.keys(nodesToRender).reduce(
                            (acc, k) => {
                                const isStaying = !listOfNodesToRemove.find(
                                    (x) => x === k
                                )
                                if (isStaying) {
                                    acc[k] = nodesToRender[k]
                                }
                                return acc
                            },
                            {}
                        )

                        /**
                         * Set new state
                         */
                        setEdges({
                            ...newEdges,
                            [`${connectorState.start}#${id}`]: true
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
                                ...nodesToRender[id],
                                x: x + props.viewport.x,
                                y: y + props.viewport.y
                            }
                        })
                    }}
                    x={nodesToRender[id].x - props.viewport.x}
                    y={nodesToRender[id].y - props.viewport.y}
                    z={props.viewport.z}
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
                return showOutput ? (
                    <Output
                        nodes={nodesToRender}
                        edges={edges}
                        close={() => setShowOutput(false)}
                    />
                ) : (
                    ''
                )
            }}
            pan={(e) => {
                const isMeta = e.metaKey
                // const mousePosition = {
                //     x: e.clientX,
                //     y: e.clientY
                // }

                // // const canvas = e.target.parentElement.getBoundingClientRect()
                // const canvasPosition = {
                //     x: 80,
                //     y: 80
                // }
                setPanPosition((x) => {
                    const z = isMeta ? x.z - e.deltaY : x.z
                    const zMin = Math.min(z, 100)
                    const zMinMax = Math.max(zMin, -80)

                    return {
                        x: isMeta ? x.x : x.x + e.deltaX,
                        y: isMeta ? x.y : x.y + e.deltaY,
                        z: zMinMax
                    }
                })
            }}
            panPosition={panPosition}
        >
            <CanvasRenderEdges
                edges={edges}
                nodes={nodesToRender}
                setEdges={setEdges}
                setNodes={setNodes}
                editMode={editMode}
                offset={panPosition}
                inProgressLine={inProgressLine}
            />
            <RenderNodes
                viewport={panPosition}
                inProgressLine={inProgressLine}
                setInProgressLine={setInProgressLine}
            />
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
            <button
                style={
                    {
                        // zIndex: 100000,
                        // background: 'white',
                        // padding: '10px 20px',
                        // borderRadius: 4,
                        // position: 'absolute',
                        // bottom: 10,
                        // left: 10
                    }
                }
                className="absolute bottom-3 left-3 bg-gray-700 shadow text-white px-4 py-2 rounded"
                onClick={() => {
                    if (viewOn) {
                        setViewOn(false)
                        return
                    }
                    const getRootNodes = (omitList, omitNodesRecord) => {
                        let rootNodes = Object.keys(nodes).reduce((acc, k) => {
                            if (!omitList.includes(k)) {
                                acc[k] = nodes[k]
                                return acc
                            } else {
                                return acc
                            }
                        }, {})
                        console.log('THE NODES', rootNodes)
                        Object.keys(edges)
                            .filter(
                                (edge) => !omitNodesRecord[edge.split('#')[0]]
                            )
                            .forEach((k) => {
                                let end = k.split('#')[1]
                                if (rootNodes[end]) {
                                    delete rootNodes[end]
                                }
                            })
                        let rootResults = []
                        Object.keys(rootNodes).forEach((k) => {
                            rootResults.push(k)
                        })
                        return rootResults
                    }
                    /**
                     * FIND ROOT NODES
                     */
                    // let rootNodes = Object.assign({}, nodes)
                    // Object.keys(edges).forEach((k) => {
                    //     let end = k.split('#')[1]
                    //     if (rootNodes[end]) {
                    //         delete rootNodes[end]
                    //     }
                    // })
                    // let rootResults = []
                    // Object.keys(rootNodes).forEach((k) => {
                    //     rootResults.push(k)
                    // })

                    // let rootResults = getRootNodes([])
                    // let secondResults = getRootNodes([...rootResults])

                    let globalOmitList = Object.keys(nodes).filter((x) => {
                        return (
                            nodes[x].resourceType === 'DynamoDB' ||
                            nodes[x].resourceType === 'CognitoUserPool'
                        )
                    })

                    let columns = []
                    let numberInLastRow = Infinity
                    let limit = 20
                    while (numberInLastRow > 0 && limit > 0) {
                        let omitList = columns.reduce((acc, x) => {
                            return [...acc, ...x]
                        }, [])

                        // omitList = [...omitList, ...globalOmitList]

                        let omitRecord = omitList.reduce((acc, x) => {
                            acc[x] = true
                            return acc
                        }, {})

                        let result = getRootNodes(omitList, omitRecord)

                        if (result.length > 0) {
                            columns.push(result)
                        }
                        numberInLastRow = result.length
                        limit--
                    }

                    let viewNodeResult = {}

                    columns.forEach((listOfNodes, colIndex) => {
                        listOfNodes.forEach((node, rowIndex) => {
                            viewNodeResult[node] = {
                                ...nodes[node],
                                x: 100 + colIndex * 300,
                                y: 100 + rowIndex * 100
                            }
                        })
                    })

                    setViewNodes(viewNodeResult)
                    setViewOn(true)
                }}
            >
                Cleanup Layout
            </button>
        </Layout>
    )
}
