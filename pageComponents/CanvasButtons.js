export function CanvasButtons(props) {
    return (
        <>
            <button
                onClick={props.addLambda}
                className="absolute top-3 right-3 bg-gray-600 shadow text-white px-4 py-2 rounded"
            >
                + Lambda
            </button>
            <button
                onClick={props.addDb}
                className="absolute top-16 right-3 bg-gray-600 shadow text-white px-4 py-2 rounded"
            >
                + DynamoDB
            </button>
            <button
                onClick={() => props.setEditMode(!props.editMode)}
                className="absolute bottom-3 right-3 bg-gray-700 shadow text-white px-4 py-2 rounded"
            >
                {props.editMode ? 'Set to Presention Mode' : 'Set to Edit Mode'}
            </button>
            <button
                onClick={() => props.setShowOutput(!props.showOutput)}
                className="absolute bottom-16 right-3 bg-gray-700 shadow text-white px-4 py-2 rounded"
            >
                {props.showOutput ? 'Hide Output' : 'Show Output'}
            </button>
            <button
                onClick={() => props.setSnapOn(!props.snapOn)}
                className="absolute bottom-32 right-3 bg-gray-700 shadow text-white px-4 py-2 rounded"
            >
                {props.snapOn ? 'SnapGrid On' : 'SnapGrid Off'}
            </button>
        </>
    )
}
