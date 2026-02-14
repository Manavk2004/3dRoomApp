import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

const Visualizer = () => {
    const location = useLocation()
    const [state, setState] = useState<{ initialImage?: string; name?: string }>({})

    useEffect(() => {
        if (location.state) {
            setState(location.state)
        }
    }, [location.state])

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
