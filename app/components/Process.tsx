import React from 'react'

const steps = [
    {
        title:"Przygotowanie projektu"
    },
    {
        title: "Wizualizacja wybranego projektu na docelowej powierzchni"
    },
    {
        title: "Wycena i podpisanie umowy"
    },
    {
        title: "Realizacja"
    },
    {
        title: "Odbiór wykonanego zlecenia"
    },
    {
        title: "Rozliczenie"
    }

]
const Process = () => {
  return (
    <div>
      {
        steps.map((step, index) => (
            <div key={index} className='border-1 border-solid border-gray-400 flex justify-center items-center px-2 py-2 '>
                <h3>{step.title}</h3>
            </div>
        ))
      }
    </div>
  )
}

export default Process
