export function CanvasButtons(props) {
    return (
        <>
            <div className="absolute top-3 right-3 ">
                <button onClick={props.addLambda} className="bg-gray-600 shadow text-white px-4 py-2 rounded mb-2">
                    + Lambda
                </button>
                <button onClick={props.addDb} className="bg-gray-600 shadow text-white px-4 py-2 rounded mb-2">
                    + DynamoDB
                </button>
                <button onClick={props.addApi} className="bg-gray-600 shadow text-white px-4 py-2 rounded mb-2">
                    + ApiGateway
                </button>
                <button onClick={props.addEventRule} className="bg-gray-600 shadow text-white px-4 py-2 rounded mb-2">
                    + EventRule
                </button>
                <button
                    onClick={props.addCognitoUserPool}
                    className="bg-gray-600 shadow text-white px-4 py-2 rounded mb-2"
                >
                    + User Pool
                </button>
            </div>
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
