import resourceDefinitions from '../awsResourceTiles'

const GRID_SIZE = 32

function Point(props) {
    return (
        <div
            key={props.id}
            className={`bg-gray-200 target flex shadow-lg overflow-hidden bg-gray-200 hover:w-3 hover:h-3 vector`}
            style={{
                position: 'absolute',
                width: props.editMode ? 8 : 0,
                height: props.editMode ? 8 : 0,
                borderRadius: 6,
                cursor: 'move' /* fallback if grab cursor is unsupported */,
                cursor: 'grab',
                userSelect: 'none',
                transform: `translate(${props.x - 4}px,${props.y - 4}px) scale(${2})`
            }}
            onMouseDown={(event) => {
                if (!props.editMode) {
                    return
                }
                let doc = document
                const containerBounds = document.getElementById('canvas').getBoundingClientRect()
                let setBlockedPosition = (event) => {
                    const xExact = event.clientX - containerBounds.left
                    const yExact = event.clientY - containerBounds.top

                    if (!props.snapOn) {
                        props.set(xExact, yExact)
                        return
                    }

                    /**
                     * switching between ceil and floor makes it feel like the "click area",
                     * or in this case drag area is bigger
                     */
                    const operatorX = xExact % 32 > 15 ? 'ceil' : 'floor'
                    const operatorY = yExact % 32 > 15 ? 'ceil' : 'floor'

                    const x = Math[operatorX](xExact / GRID_SIZE) * GRID_SIZE
                    const y = Math[operatorY](yExact / GRID_SIZE) * GRID_SIZE

                    props.set(x, y)
                }

                setBlockedPosition(event)

                function onMouseMove(event) {
                    setBlockedPosition(event)
                }

                function onMouseUp() {
                    doc.removeEventListener('mousemove', onMouseMove)
                    doc.removeEventListener('mouseup', onMouseUp)
                }

                doc.addEventListener('mousemove', onMouseMove)
                doc.addEventListener('mouseup', onMouseUp)
            }}
        ></div>
    )
}

function Tile(props) {
    const Icon = () => resourceDefinitions[props.resourceType].icon()
    return (
        <div
            key={props.id}
            className={`bg-gray-600 target flex shadow overflow-hidden ${props.color} ${
                props.flashing && 'animate-pulse'
            }`}
            style={{
                position: 'absolute',
                width: 64 * 4,
                height: 64,
                borderRadius: 4,
                cursor: 'move' /* fallback if grab cursor is unsupported */,
                cursor: 'grab',
                userSelect: 'none',

                transform: `translate(${props.x}px,${props.y}px) scale(${1})`
            }}
            onMouseDown={(event) => {
                const mouseDownTimeStamp = event.timeStamp
                const elementBelow = document.elementFromPoint(event.clientX, event.clientY)

                /**
                 * If Connector Click
                 */
                const elementBelowIsStartConnector = elementBelow.classList.contains('connector-start')
                const elementBelowIsEndConnector = elementBelow.classList.contains('connector-end')

                if (elementBelowIsEndConnector) {
                    props.setStartConnector(props.id)
                    return
                }
                if (elementBelowIsStartConnector) {
                    props.setEndConnector(props.id)
                    return
                }

                const containerBounds = document.getElementById('canvas').getBoundingClientRect()

                let mouseTilePositionOffset = {
                    x: 0,
                    y: 0
                }

                const getYX = (event, containerBounds, mouseTilePositionOffset) => {
                    const xExact = event.clientX - containerBounds.left
                    const yExact = event.clientY - containerBounds.top

                    const x = xExact - mouseTilePositionOffset.x
                    const y = yExact - mouseTilePositionOffset.y

                    const snapX = props.snapOn ? Math.floor(x / GRID_SIZE) * GRID_SIZE : x
                    const snapY = props.snapOn ? Math.floor(y / GRID_SIZE) * GRID_SIZE : y
                    return { snapX, snapY }
                }

                /**
                 * On mouse down, we execute this method, and on drag and mouse up
                 * we execute another. This difference is that we record the location
                 * of the mouse in relation to the tile, so that we can calculate the
                 * new position transform values by offsetting the mouse position in the
                 * tile.
                 */
                const setFirstBlockedPosition = (event) => {
                    const rect = event.target.closest('.target').getBoundingClientRect()
                    mouseTilePositionOffset = {
                        x: event.clientX - rect.x,
                        y: event.clientY - rect.y
                    }

                    const { snapX, snapY } = getYX(event, containerBounds, mouseTilePositionOffset)
                    props.set(snapX, snapY)
                }

                const setBlockedPosition = (event) => {
                    const { snapX, snapY } = getYX(event, containerBounds, mouseTilePositionOffset)
                    props.set(snapX, snapY)
                }

                setFirstBlockedPosition(event)

                const onMouseMove = (event) => {
                    setBlockedPosition(event)
                }

                const onMouseUp = (event) => {
                    const mouseUpTimeStamp = event.timeStamp
                    const diff = mouseUpTimeStamp - mouseDownTimeStamp

                    if (diff < 150) {
                        props.onEditClick()
                    }

                    document.removeEventListener('mousemove', onMouseMove)
                    document.removeEventListener('mouseup', onMouseUp)
                }

                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)
            }}
        >
            {props.type === 'end' && (
                <div className="cursor-pointer hover:bg-gray-400 top-0 right-0 bottom-0 w-4 bg-gray-700 connector-start  flex items-center"></div>
            )}
            <Icon />
            <div className="px-2 py-2 text-gray-100 text-left">
                <p
                    style={{
                        fontSize: 8
                    }}
                >
                    {props.resourceCFName}
                </p>
                <p
                    className="font-bold"
                    style={{
                        fontSize: 20
                    }}
                >
                    {props.name}
                </p>
            </div>
            {props.type === 'start' && (
                <div className="cursor-pointer hover:bg-gray-400 absolute top-0 right-0 bottom-0 w-4 bg-gray-700 connector-end"></div>
            )}
        </div>
    )
}

export function Node(props) {
    if (props.nodeType && props.nodeType === 'vector') {
        return <Point {...props} />
    } else {
        return <Tile {...props} />
    }
}
