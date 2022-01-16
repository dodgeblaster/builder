import { Edge } from '../components/Edge'

const RenderLine = (props) => {
    // this inset makes vertical lines not straight. May need to consider making tiles a bit
    // bigger than the grid so that the inset results in straight vertical lines
    const INSET = 8
    const TILE_WIDTH = 260
    const TILE_HEIGHT = 64

    let startCoordinates = props.startId.toString().startsWith('vector')
        ? {
              sourceX: props.start.x,
              sourceY: props.start.y
          }
        : {
              sourceX: props.start.x + TILE_WIDTH - INSET,
              sourceY: props.start.y + TILE_HEIGHT / 2
          }

    let endCoordinates = props.endId.toString().startsWith('vector')
        ? { targetX: props.end.x, targetY: props.end.y }
        : {
              targetX: props.end.x + INSET,
              targetY: props.end.y + TILE_HEIGHT / 2
          }
    return (
        <Edge
            sourceX={startCoordinates.sourceX}
            sourceY={startCoordinates.sourceY}
            targetX={endCoordinates.targetX}
            targetY={endCoordinates.targetY}
            editMode={props.editMode}
            onClick={(x, y) => {
                const vectorId = 'vector_' + Date.now().toString()
                props.setNodes((nodes) => ({
                    ...nodes,
                    [vectorId]: {
                        id: vectorId,
                        nodeType: 'vector',
                        x,
                        y
                    }
                }))

                props.setEdges({
                    ...Object.keys(props.edges)
                        .filter((id) => id !== props.startId)
                        .reduce((acc, id) => {
                            acc[id] = props.edges[id]
                            return acc
                        }, {}),
                    [props.startId]: vectorId,
                    [vectorId]: props.endId
                })
            }}
        />
    )
}

export function CanvasRenderEdges(props) {
    return (
        <svg
            width="4000"
            height="4000"
            style={{
                position: 'absolute',
                top: 0,
                transition: '1s'
            }}
        >
            {Object.keys(props.edges).map((k) => {
                const startId = k
                const endId = props.edges[k]

                const start = props.nodes[startId]
                const end = props.nodes[endId]
                return (
                    <RenderLine
                        key={k}
                        edges={props.edges}
                        editMode={props.editMode}
                        start={start}
                        end={end}
                        startId={startId}
                        endId={endId}
                        setNodes={props.setNodes}
                        setEdges={props.setEdges}
                    />
                )
            })}
        </svg>
    )
}
