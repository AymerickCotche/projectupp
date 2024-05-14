import React from 'react'

interface MyProps {
  entity: string
}

function Filter({entity} : MyProps) {
  return (
    <div className='bg-white border p-2'>
      Ici ça filtre
    </div>
  )
  
}

export default Filter