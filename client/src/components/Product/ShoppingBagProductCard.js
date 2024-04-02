import { useStoreContext } from "../../utils/GlobalState";
import { REMOVE_FROM_SHOPPING_BAG, UPDATE_SHOPPING_BAG_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

const ShoppingBagItemCard = ({ item }) => {

    // const [, dispatch] = useStoreContext();

    // const removeFromShoppingBag = item => {
    //     dispatch({
    //         type: REMOVE_FROM_SHOPPING_BAG,
    //         _id: item._id
    //     });
    //     idbPromise('shoppingBag', 'delete', { ...item });

    // };

    // const onChange = (e) => {
    //     const value = e.target.value;
    //     if (value === '0') {
    //         dispatch({
    //             type: REMOVE_FROM_SHOPPING_BAG,
    //             _id: item._id
    //         });
    //         idbPromise('shoppingBag', 'delete', { ...item });

    //     } else {
    //         dispatch({
    //             type: UPDATE_SHOPPING_BAG_QUANTITY,
    //             _id: item._id,
    //             purchaseQuantity: parseInt(value)
    //         });
    //         idbPromise('shoppingBag', 'put', { ...item, purchaseQuantity: parseInt(value) });
    //     }
    // }

    return (
        <div></div>
    );
}

export default ShoppingBagItemCard;