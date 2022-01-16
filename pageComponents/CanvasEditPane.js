import { useEffect, useState } from 'react'

export function CanvasEditPane(props) {
    const [name, setName] = useState('')
    useEffect(() => {
        if (props.open) {
            setName(props.initName)
        }
    }, [props.open])
    return (
        <div
            className="absolute top-3 right-3 bottom-3 rounded bg-gray-200 overflow-hidden"
            style={{
                transition: '0.2s',
                width: 300,
                transform: `translateX(${props.open ? '0' : '320'}px)`
            }}
        >
            <div className="flex bg-white px-3 py-3 border-b border-gray-300 font-bold items-center">
                <p>Editor</p>
                <button className=" ml-auto rounded px-3 py-1 bg-gray-300" onClick={props.close}>
                    Close
                </button>
            </div>
            <div className="px-3 py-3">
                <div className="mb-3 text-left">
                    <p
                        className="mb-1"
                        style={{
                            fontSize: 12
                        }}
                    >
                        Name of Resource
                    </p>
                    <input
                        className=" w-full rounded px-4 py-2 bg-gray-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3 text-left">
                    <button
                        className=" ml-auto rounded px-3 py-1 bg-green-600 text-green-100"
                        onClick={() => props.save(props.id, name)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
