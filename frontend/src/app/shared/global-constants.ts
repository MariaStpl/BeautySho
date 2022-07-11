export class GlobalConstants{
    //Message
    public static genericError:string = "Something went wrong. Please try again later";

    public static unauthroized:string = "You are not authorized person to access this page.";

    public static mustlogin:string = "You must login first before checkout.";

    public static productExistError: string = "Product already exist.";
    public static productAdded : string = "Product Added Successfully.";

    public static productDeleted : string = "Product Deleted Successfully.";
    

    //Regex
    public static nameRegex:string = "[a-zA-Z0-9 ]*";

    public static emailRegex:string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex:string = "^[e0-9]{11,12}$";

    //Variable
    public static error:string = "error";
    
}