import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice ({
  name: 'cart',
  initialState: {
    cart:[],
    cartNo:1,
    summery: {tax:0,shipping:0,discount:0,cart_no:1},
  },
  reducers:{
    updateAll(state, action){
      state.cart = action.payload.cart;
      state.cartNo = action.payload.cartNo;
      state.summery = action.payload.summery;
    },
    updateCart(state, action){
      state.cart = action.payload;
    },
    updateCartNo(state, action){
      state.cartNo = action.payload;
    },
    updateSummery(state, action){
      state.summery = action.payload;
    }
  }
});

export default cartSlice.reducer;
export const { updateAll, updateCart, updateCartNo, updateSummery } = cartSlice.actions;