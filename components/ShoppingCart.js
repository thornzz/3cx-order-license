import React, { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { storeWithObject } from "../stores/store"

const ShoppingCart = (props) => {
    const [items, setItems] = useState(0)

    const handleAddItem = () => {
        setItems(items + 1)
    }

    return (
        <div className="relative inline-block text-left">
            <div
                className="bg-gray-200 rounded-full w-[25px] px-2 mx-2 text-sm  text-gray-800"
            >
                {storeWithObject.count}
            </div>
            <button onClick={handleAddItem}>
                <FaShoppingCart className="text-white hover:text-gray-200 w-[20px]" />
            </button>
        </div>
    )
}

export default ShoppingCart