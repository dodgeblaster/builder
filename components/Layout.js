import Head from 'next/head'
import { useState, useLayoutEffect } from 'react'

function useWindowSize() {
    const [size, setSize] = useState([0, 0])
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight])
        }
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])
    return size
}

export function Layout(props) {
    const [width, height] = useWindowSize()
    const Output = () => props.output()

    const CANVAS_WIDTH = Math.floor(width * 0.8)
    const CANVAS_HEIGHT = Math.floor(height * 0.8)
    return (
        <div>
            <Head>
                <title>AWS Builder</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20">
                <div className="flex mt-10 items-center text-left">
                    <h1 className="text-2xl font-bold mb-2">AWS Builder</h1>
                    <a href="https://www.loom.com/share/660be7692054433c9877a9588ba80bf0" className="ml-10">
                        📺 Walkthru Video
                    </a>
                    <a href="" className="ml-10">
                        📕 Github Repo
                    </a>
                </div>

                <div
                    className="relative mx-auto"
                    style={{
                        width: CANVAS_WIDTH,
                        height: CANVAS_HEIGHT
                    }}
                >
                    <div
                        id="canvas"
                        className="rounded-lg bg-gray-800 relative overflow-hidden"
                        style={{
                            height: CANVAS_HEIGHT,
                            width: CANVAS_WIDTH,
                            position: 'absolute',
                            top: 0,
                            zIndex: 10
                        }}
                    >
                        {[...Array(100).keys()].map((_, i) => {
                            return (
                                <div
                                    key={'horizontal' + i}
                                    className="border-b border-gray-700"
                                    style={{
                                        width: CANVAS_WIDTH + 100,
                                        position: 'absolute',
                                        height: 1,

                                        top: i * 32
                                    }}
                                />
                            )
                        })}
                        {[...Array(100).keys()].map((_, i) => {
                            return (
                                <div
                                    key={'vertical' + i}
                                    className="border-r border-gray-700"
                                    style={{
                                        height: CANVAS_HEIGHT + 100,
                                        position: 'absolute',
                                        width: 1,

                                        left: i * 32
                                    }}
                                />
                            )
                        })}
                        {props.children}
                    </div>
                </div>
                <Output />
            </main>
        </div>
    )
}
