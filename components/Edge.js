export function Edge({ sourceX, sourceY, targetX, targetY, onClick, editMode }) {
    return (
        <g
            onClick={(event) => {
                const containerBounds = document.getElementById('canvas').getBoundingClientRect()
                const xExact = event.clientX - containerBounds.left
                const yExact = event.clientY - containerBounds.top
                onClick(xExact, yExact)
            }}
        >
            <path
                fill="none"
                stroke="#fff"
                strokeWidth={editMode ? 4.5 : 1.5}
                className="animated"
                d={`M${sourceX},${sourceY} ${targetX},${targetY}`}
            />
        </g>
    )
}
