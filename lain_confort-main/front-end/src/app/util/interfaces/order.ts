import { Iproduct } from "./iproduct"

export interface IOrder{
  _id?:string;
  order_details:{
    details:string,
    phone:string,
    address:string
  };
  products:Iproduct[];
    total?:number

}
