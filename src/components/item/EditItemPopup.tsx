import React, { useState, useEffect } from 'react';
import Button from "@/src/components/ui/button";

interface EditItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatedItem: (item: any) => void;
  itemName: string;
  itemID: number;
  itemImage: string;
  itemDescription: string;
  totalItems: number;
  storageQuantity: number;
  lentOutCount: number;
  missingCount: number;
}

const EditItemPopup: React.FC<EditItemPopupProps> = ({
  isOpen,
  onClose,
  onUpdatedItem,
  itemName,
  itemID,
  itemImage,
  itemDescription,
  totalItems,
  storageQuantity,
  lentOutCount,
  missingCount,
}) => {
  const [itemNameState, setItemNameState] = useState(itemName);
  const [itemDescriptionState, setItemDescriptionState] = useState(itemDescription);
  const [totalItemsState, setTotalItemsState] = useState(totalItems);
  const [storageQuantityState, setStorageQuantityState] = useState(storageQuantity);
  const [lentOutCountState, setLentOutCountState] = useState(lentOutCount);
  const [missingCountState, setMissingCountState] = useState(missingCount);
  const [hasChanges, setHasChanges] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    setItemNameState(itemName);
    setItemDescriptionState(itemDescription);
    setTotalItemsState(totalItems);
    setStorageQuantityState(storageQuantity);
    setLentOutCountState(lentOutCount);
    setMissingCountState(missingCount);
  }, [itemName, itemDescription, totalItems, storageQuantity, lentOutCount, missingCount]);

    const handleUpdate = () => {
      if (storageQuantityState < 0 || lentOutCountState < 0 || missingCountState < 0) {
        setUpdateMessage('Storage Quantity, Lent Out Count, and Missing Count must be 0 or greater.');
        return;
      }

    const changes: Record<string, any> = {};
    
    if (itemNameState !== itemName) changes.itemName = itemNameState;
    if (itemDescriptionState !== itemDescription) changes.itemDescription = itemDescriptionState;
    if (totalItemsState !== totalItems) changes.totalItems = totalItemsState;
    if (storageQuantityState !== storageQuantity) changes.storageQuantity = storageQuantityState;
    if (lentOutCountState !== lentOutCount) changes.lentOutCount = lentOutCountState;
    if (missingCountState !== missingCount) changes.missingCount = missingCountState;

    const formData = new FormData();
    if (selectedImage) {
      formData.append('itemImage', selectedImage);
    }

    Object.keys(changes).forEach(key => {
      formData.append(key, changes[key]);
    });

    if (Object.keys(changes).length > 0 || selectedImage) {
      fetch(`/api/updateItem/${itemID}`, {
        method: 'PATCH',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          onUpdatedItem({
            item_name: changes.itemName ?? itemName,
            item_description: changes.itemDescription ?? itemDescription,
            total_items: changes.totalItems ?? totalItems,
            storage_quantity: changes.storageQuantity ?? storageQuantity,
            lent_out_count: changes.lentOutCount ?? lentOutCount,
            missing_count: changes.missingCount ?? missingCount,
            item_image: selectedImage ? URL.createObjectURL(selectedImage) : itemImage,
            id: itemID,
          });          
          setUpdateMessage(data.message);
          onClose();
        })
        .catch((error) => {
          console.error('Error:', error);
          setUpdateMessage('Error updating item.');
        });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="backdrop-blur-md rounded-lg shadow-lg w-full h-auto m-60 text-white/80 p-4">
        <h2 className="text-xl font-bold mb-4">Edit {itemName} item</h2>
        {updateMessage && <p className='text-red-500'>{updateMessage}</p>}
        <form>
          <ul className="flex flex-wrap gap-4">
            <li className="flex flex-col">
              <label>Item Name</label>
              <input
                type="text"
                className="w-40 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Name"
                value={itemNameState}
                onChange={(e) => {
                  setItemNameState(e.target.value);
                  setHasChanges(true);
                }}
                required
              />
            </li>
            <li className="flex flex-col">
              <label>Item Image</label>
              <input
                type="file"
                className="w-56 p-2 rounded-lg"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedImage(e.target.files[0]);
                    setHasChanges(true);
                  }
                }}
              />
            </li>
            <li className="flex flex-col">
              <label>Item Description</label>
              <textarea
                className="w-60 h-14 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Description"
                value={itemDescriptionState}
                onChange={(e) => {
                  setItemDescriptionState(e.target.value);
                  setHasChanges(true);
                }}
              />
            </li>
            <li className="flex flex-col">
              <label>Total Items</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Total"
                value={totalItemsState}
                onChange={(e) => {
                  setTotalItemsState(Number(e.target.value));
                  setHasChanges(true);
                }}
                required
              />
            </li>
            <li className="flex flex-col">
              <label>Items in Storage</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Storage"
                value={storageQuantityState}
                onChange={(e) => {
                  setStorageQuantityState(Number(e.target.value));
                  setHasChanges(true);
                }}
              />
            </li>
            <li className="flex flex-col">
              <label>Items Lent Out</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Lent Out"
                value={lentOutCountState}
                onChange={(e) => {
                  setLentOutCountState(Number(e.target.value));
                  setHasChanges(true);
                }}
              />
            </li>
            <li className="flex flex-col">
              <label>Items Missing</label>
              <input
                type="number"
                className="w-24 h-10 p-2 rounded-lg border placeholder:text-black/60 text-black"
                placeholder="Missing"
                value={missingCountState}
                onChange={(e) => {
                  setMissingCountState(Number(e.target.value));
                  setHasChanges(true);
                }}
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
              onClick={handleUpdate}
              type="button"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemPopup;
