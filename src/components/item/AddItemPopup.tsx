import React, { useState, ChangeEvent, FormEvent } from "react";
import Button from "@/src/components/ui/button";

interface AddItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: any) => void;
}

const AddItemPopup: React.FC<AddItemPopupProps> = ({ isOpen, onClose, onAddItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [itemDescription, setItemDescription] = useState("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [storageQuantity, setStorageQuantity] = useState<number>(0);
  const [lentOutCount, setLentOutCount] = useState<number>(0);
  const [missingCount, setMissingCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (storageQuantity < 0 || lentOutCount < 0 || missingCount < 0) {
        setErrorMessage("Storage Quantity, Lent Out Count, and Missing Count must be 0 or greater.");
        return;
    }

    const totalCount = storageQuantity + lentOutCount + missingCount;
    if (totalCount !== totalItems) {
        setErrorMessage(`The sum of Storage Quantity (${storageQuantity}), Lent Out Count (${lentOutCount}), and Missing Count (${missingCount}) must equal TotalItems value. That mean you need to minimum have a value of: (${totalCount}).`);
        return;
    }

    const formData = new FormData();
    formData.append('item_name', itemName);
    if (itemImage) formData.append('item_image', itemImage);
    formData.append('item_description', itemDescription);
    formData.append('total_items', totalItems.toString());
    formData.append('storage_quantity', storageQuantity.toString());
    formData.append('lent_out_count', lentOutCount.toString());
    formData.append('missing_count', missingCount.toString());

    try {
        const response = await fetch('/api/uploadItem', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Created item:', data);
            onAddItem(data);
            onClose();
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.error || 'Error creating item');
        }
    } catch (error) {
        console.error('Error in creating item:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="backdrop-blur-md rounded-lg shadow-lg w-full h-auto m-60 text-white/80 p-4">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <ul className="flex flex-wrap gap-4">
            <li className="flex flex-col">
              <label>Item Name</label>
              <input
                type="text"
                className="w-40 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </li>
            <li className="flex flex-col">
              <label>Item Image</label>
              <input
                type="file"
                className="w-56 p-2 rounded-lg"
                onChange={handleImageChange}
              />
            </li>
            <li className="flex flex-col">
              <label>Item Description</label>
              <textarea
                className="w-60 h-14 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </li>
            <li className="flex flex-col">
              <label>Total Items</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Total"
                value={totalItems}
                onChange={(e) => setTotalItems(Number(e.target.value))}
                required
              />
            </li>
            <li className="flex flex-col">
              <label>Items in Storage</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Storage"
                value={storageQuantity}
                onChange={(e) => setStorageQuantity(Number(e.target.value))}
              />
            </li>
            <li className="flex flex-col">
              <label>Items Lent Out</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Lent Out"
                value={lentOutCount}
                onChange={(e) => setLentOutCount(Number(e.target.value))}
              />
            </li>
            <li className="flex flex-col">
              <label>Items Missing</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Missing"
                value={missingCount}
                onChange={(e) => setMissingCount(Number(e.target.value))}
              />
            </li>
          </ul>
          <div className="flex justify-end mt-8 gap-2">
            <Button
              variant="outline"
              className="border-gray-500 text-white hover:bg-gray-500 hover:text-black"
              onClick={onClose}
              type="button"
            >
              Close
            </Button>
            <Button
              variant="default"
              className="border-gray-500 text-white bg-gray-500 hover:bg-gray-600 hover:text-white/80"
              type="submit"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemPopup;
