export const GTM_ID = 'GTM-KHH6J47'
export const GTM_EC_EVENT_FIELD = 'user_email'

export enum GoogleTagManagerEvent {
  pageLoad = 'page_load',
  pageView = 'pageView',
  modalView = 'modalView',
  Login = 'User_Login',
  Register = 'User_Register',
  PhotoUpload = 'Item_Photo_Upload',
  ItemList = 'Item_List',
  ItemBuy = 'Item_Buy',
  ItemView = 'Item_View_Details',
  BuyStart = 'Item_Buy_Start',
  FirstList = 'First_List',
  FirstBuy = 'First_Buy',
  SecondDayList = 'Second_Day_List',
  ViewCatalog = 'View_Catalog',
  SelectItem = 'Select_Item',
  AddToFavourites = 'Add_To_Favourites',
  RemoveFromBundle = 'Remove_From_Bundle',
}

export enum PageType {
  SearchResult = 'Search Result Page',
  ProductDisplay = 'Product Display Page',
  ProductListings = 'Product Listings Page',
  Checkout = 'Checkout Page',
  Favourites = 'Favourites Page',
  Registration = 'Register Page',
  Login = 'Login Page',
  OrderComplete = 'Order Complete Page',
  AddListing = 'Add listing Page',
  Others = 'Others',
}

export enum FormName {
  Login = 'Login',
  Register = 'Register',
  AddListing = 'Add listing',
  Checkout = 'Checkout',
}

export enum LoginStatus {
  Logged = 'Logged In',
  NotLogged = 'Not Logged In',
}
