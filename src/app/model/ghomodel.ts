export  type ghoiin={
  Token:string;
  Action:string;
  Mode:string;
  BrowseInfo:string;
  Lts:string;
  Tags:tags[];
}

export class tags
{
  T:string ="";
  V:string ="" ;
}

export class ghoresult 
{
  Status: number =0;
  Error: string ="";
  Info: string ="";
  Data: any[] =[];
}


export class Lists
{
  D:string ="";
  T:string ="" ;
}

export class user 
{
  id: string ="";
  pwd: string ="";
  fname: string ="";
  lname: string ="";
  cntry: string ="";
  ph: string ="";
  otp:string ="";
  confirmPwd: string;
}


export class casemedication 
{
  id: number =0;
  MedicationName: string = "";
  StartMonth: number = 0  ;
  StartYear: number = 0  ;
  EndMonth: number = 0  ;
  EndYear: number = 0  ;
  IsActive:number=0;
}


export class files 
{
  file:File;
  progress:number=-1;
  status:number = 0;
  doctype:number = 0;

}