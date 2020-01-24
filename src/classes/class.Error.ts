class Err {
  code: number;
  msg: string;
  details?: any;

  constructor(Code: number, Msg: string, Details?: any){
    this.code = Code;
    this.msg = Msg;
    if(Details){
      this.details = Details;
    }
  }
}

export { Err };