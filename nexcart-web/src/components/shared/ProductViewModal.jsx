import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Divider } from '@mui/material';
import { useState } from 'react'
import Status from './Status';
import { MdClose, MdDone } from 'react-icons/md';
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";

function ProductViewModal({open, setOpen, product, isAvailable}) {
  
  const {id, productName, image, description, quantity, price, discount, specialPrice} = product;
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  }

  const addToCartHandler = () => {
  dispatch(
    addToCart(
      {
        image,
        productName,
        description,
        specialPrice,
        price,
        productId: id,
        quantity,
      },
      qty,
      toast
    )
  );
};

  return (
    <>
      <Dialog open={open} as="div" className="relative z-10"  onClose={() => setOpen(false)}
>
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all md:max-w-[620px] md:min-w-[620px] w-full"
            >
                {image && (
                    <div className='flex justify-center aspect-3/2'>
                    <img 
                    src={image}
                    alt={productName} />
                    </div>
                )}



                <div className='px-6 pt-10 pb-2'>
                <DialogTitle as="h1" className="lg:text-3xl sm:text-2xl text-xl font-semibold leading-6 text-gray-800 mb-4">
                {productName}
              </DialogTitle>

              <div className="flex items-center mt-3 mb-4">
                <span className="text-yellow-400 text-lg">
                  ★★★★★
                </span>

              <span className="ml-2 text-sm text-gray-500">
               (124 Reviews)
             </span>
              </div>


              <div className="space-y-2 text-gray-700 pb-4">
                <div className="flex items-center justify-between gap-2">
                  {specialPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through">
                        ${Number(price).toFixed(2)}
                      </span>
                      <span className="sm:text-xl font-semibold text-slate-700">
                        ${Number(specialPrice).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold">
                      {" "}
                      ${Number(price).toFixed(2)}
                    </span>
                  )}

                  {isAvailable ? (
                    <Status
                      text="In Stock"
                      icon={MdDone}
                      bg="bg-teal-200"
                      color="text-teal-900"
                    />
                  ) : (
                    <Status
                      text="Out-Of-Stock"
                      icon={MdClose}
                      bg="bg-rose-200"
                      color="text-rose-700"
                    />
                  )}
                </div>

                <Divider />

                <p>{description}</p>

                <div className="flex items-center gap-3 mt-5">
                  <button
                   onClick={() => qty > 1 && setQty(qty - 1)}
                   className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
               >
                 -
                </button>

                <span className="font-semibold text-lg">
                 {qty}
                </span>

               <button
                   onClick={() => setQty(qty + 1)}
                   className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                 +
               </button>
                </div>

             <button
  onClick={addToCartHandler}
  className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
>
  Add To Cart
</button>
             <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2">
                 <p>✓ Secure Payment</p>
                 <p>✓ Fast Delivery</p>
                 <p>✓ Easy Returns</p>
            </div>

              </div>
                </div>


            <div className="px-6 py-4 flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-700 hover:text-slate-800 hover:border-slate-800 rounded-md "
              >
                Close
              </button>
            </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ProductViewModal;