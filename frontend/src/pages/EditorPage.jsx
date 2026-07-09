import React from 'react'
import { Editor } from '../components/Editor'
import Menu from '../components/Menu'

import { useState } from 'react'

const EditorPage = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  if (isFullScreen) {
    return (
      <div className='fixed inset-0 z-50 bg-white'>
        <button
          onClick={() => setIsFullScreen(false)}
          title='Exit Full Screen'
          className='fixed bottom-6 right-6 z-[9999] h-11 w-11 rounded-md border bg-white text-xl shadow hover:bg-gray-100 cursor-pointer'>
          ⤡
        </button>

        <Editor />
      </div>
    )
  }

  return (
    <div className='min-h-screen app-gradient'>
      <Menu />

      <div className='relative mx-auto flex w-2/3 justify-center py-6'>
        <button
          onClick={() => setIsFullScreen(true)}
          title='Open Full Screen'
          className='absolute -top-6 -right-6 z-50 flex h-11 w-11 items-center justify-center rounded-md border bg-white text-xl shadow hover:bg-gray-100 cursor-pointer'>
          ⛶
        </button>

        <Editor />
      </div>
    </div>
  )
}

export default EditorPage
