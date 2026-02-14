import puter from '@heyputer/puter.js'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'

const Visualizer = () => {
    const location = useLocation()
    const { id } = useParams()
    const [state, setState] = useState<{ initialImage?: string; name?: string }>({})

    useEffect(() => {
        if (location.state) {
            setState(location.state)
            return
        }

        if (!id) return

        const loadProject = async () => {
            try {
                const project = await puter.kv.get(`project:${id}`) as DesignItem | null
                if (project) {
                    setState({
                        initialImage: project.sourceImage,
                        name: project.name || undefined,
                    })
                }
            } catch (e) {
                console.warn('Failed to load project:', e)
            }
        }

        loadProject()
    }, [id, location.state])

    const { initialImage, name } = state;

  return (
    <section>
        <h1>{ name || 'Untitled Project'}</h1>

        <div className='visualizer'>
            {initialImage && (
                <div className='image-container'>
                    <h2>Source Image</h2>
                    <img src={initialImage} alt='source' />
                </div>
            )}
        </div>
    </section>
  )
}

export default Visualizer
