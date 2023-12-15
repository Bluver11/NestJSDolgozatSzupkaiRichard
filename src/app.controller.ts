import { Controller, Get, Render,Post,Body,Res } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { newCouponDTO } from './newCouponDTO';
import e, { Response } from 'express';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'szinhaz',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [adatok] = await conn.execute('SELECT id, title, percentage, code FROM szinhazdb');

    console.log(adatok);

    return {
      szinhazdb: adatok,
    };
  }

  @Get('/newCoupon')
  @Render('newCoupon')
  newCouponForm() {
    //...
  }
  @Post('/newCoupon')
  async newCoupon(@Body() newCoupon: newCouponDTO, @Res() res: Response){
    const title = newCoupon.title;
    const percentage = newCoupon.percentage;
    const code = newCoupon.code;
    const mintaCode: RegExp = /^[A-Z]{4}-\d{6}$/;
    if(title.trim() == "" || percentage.toString().trim() == "" || code.trim() == "") {
      return { hibaUzenet: "Ki kell tölteni minden mezőt!"};
    } else if (title.length < 1){
      return { hibaUzenet: "A címnek legalább egy karakter hosszúnak kell lennie!"};
    } else if (!(percentage >= 1 && percentage <= 99)){
      return { hibaUzenet: "A százaléknak 1 és 99 között kell lennie!"};
    } else if (mintaCode.test(code) == false){
      return { hibaUzenet: "Hibás formátumban adtad meg a kódot!"};}
      else{
    const [adatok] = await conn.execute('INSERT INTO szinhazdb (title,percentage,code) VALUES(?,?,?)',
    [title,percentage,code],
    );
    res.redirect('/')
      }
  }

}
