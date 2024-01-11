import React from 'react';
import NavBar from './Components/NavBar';
import Cart from './Page Component/Purchase/Cart';
import CheckoutForSales from './Page Component/Purchase/CheckoutForSales';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Bill from './Page Component/Purchase/Bill/Bill';
import Sale from './Page Component/Sales/Sale/Sale';
import Clients from './Page Component/Clients/Clients';
import ClientHistory, {loader as clientsHistoryLoader} from './Page Component/Clients/CientsHistory';
import Products, {action as productAction} from './Page Component/Products/Products';
import AddClients,{ action as addClientAction, loader as addClientLoader} from "./Page Component/Clients/AddClients"
import AddProducts from './Page Component/Products/AddProducts';
import EditProduct, { action as editProductAction } from './Page Component/Products/EditProduct';
import Categories, {loader as categoriesLoader} from './Page Component/ProductCategory/Categories';
import AddCategory,{action as addCategoryAction} from './Page Component/ProductCategory/AddCategory/AddCategory';
import Category,{loader as categoryLoader} from './Page Component/ProductCategory/Category/Category';
import Distributors from './Page Component/Distributors/Distributors';
import AddDistributors from './Page Component/Distributors/AddDistributors';
import DistributorsHistory, {loader as distributorsHistoryLoader } from './Page Component/Distributors/DistributorsHistory';
import Login, {action as logInAction, loader as logInLoader} from './Page Component/Auth/Login';
import SignUp, {action as signUpAction} from './Page Component/Auth/SignUp';
import ErrorPage from './Page Component/ErrorPages/ErrorPage';
import { tokenLoader as rootLoader } from './Util/auth';
import { action as logoutAction} from './Page Component/Auth/Logout'
import ProductPage, {loader as productPageLoader, action as productPageAction} from './Page Component/ProductsPages/ProductPage';
import PurchaseAccount from './Page Component/PurchaseAccount/PurchaseAccount';
import PrintLabel, {loader as printLabelLoader} from './Page Component/Products/PrintLabel/PrintLabel';
import ShowTable from './Page Component/ShowTable/ShowTable';
import LabelEdit, {loader as labelLoader, action as labelAction} from './Page Component/ProductCategory/LabelEdit/LabelEdit';
import StockBookPrint from './Page Component/Products/StockBookPrint';
import PurchaseDetails from './Page Component/PurchaseAccount/PurchaseDetails';
import CheckoutForPurchase, {action as purchaseCheckoutAction} from './Page Component/Sales/Purchase/CheckoutForPurchase';
import PrintPurchaseLabel from './Page Component/PurchaseAccount/PrintPurchaseLabel';
import AddNewProductBatche from './Page Component/ProductCategory/AddNewProductBatche';

function App() {
  const router = createBrowserRouter([
    { 
      path:"/",
      element:(<NavBar />),
      errorElement:<ErrorPage />,
      loader:rootLoader,
      children:[
        {index: true,element:<Cart />},
        {path:"/sellCheckout", element:<CheckoutForSales />},
        {path:'/salesList', element:<Sale />},
        {path:'/salesList/bill/:prints/:id', element:<Bill />},

        {path:'/product/:cat/', loader:productPageLoader, action:productPageAction, element:<ProductPage />},

        {path:'/clientList', element:<Clients />},
        // {path:'/clients/details/:id', element:<Clients />},
        {path:'/clients/transaction/:id', loader: clientsHistoryLoader,element:<ClientHistory />},
        {path:'/clients/add-client', action: addClientAction, element:<AddClients />},

        {path:'/productItem',
          children:[
            {index:true, element:<Products />},
            {path:'stockBookPrint', action: productAction, element:<StockBookPrint />},
            {path:'addProducts', action: productAction, element:<AddProducts />},
            {path:':id', 
              children:[
                {index:true, action: editProductAction, element:<EditProduct />},
                {path:'label', loader:printLabelLoader, element:<PrintLabel />},
            ]},
          ]
        },


        {path:"/productsCatagory",

          children:[
            {index:true, loader:categoriesLoader, element:<Categories />},
            {path:'add', loader:categoriesLoader, action:addCategoryAction, element:<AddCategory />},

            {path:':name', 

              children:[
                {index:true, loader:categoryLoader, element:<Category />},
                {path:"addNewProductBatche", loader:categoryLoader, element:<AddNewProductBatche />},
                {path:'labelEdit',action:labelAction, loader:labelLoader, element:<LabelEdit />}
              ]
              
            },
          ]
        },

        
        {path:'/distributor', element:<Distributors />},
        {path:'/distributor/add', element:<AddDistributors />},
        {path:'/distributor/transaction/:id', loader:distributorsHistoryLoader, element:<DistributorsHistory />},

        {path:'/purchase', element:<PurchaseAccount />},
        {path:'/purchaseCheckout', action:purchaseCheckoutAction, element:<CheckoutForPurchase />},
        {path:'/purchase/:id', element:<PurchaseDetails />},
        {path:'/purchase/:id/printLabel', element:<PrintPurchaseLabel />},
        {path:'/signUpApp', action:signUpAction, element:<SignUp />},
        {path:'/showTable', element:<ShowTable />}
      ]
    },
    {path:'/loginApp', loader:logInLoader, action:logInAction, element:<Login />},
    {path: 'logout',action: logoutAction},
  ])

  

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
