import mysql from 'mysql2'

const connection = mysql.createPool({
    host: '127.0.0.1',
    user:  'root',
    password: 'kyathi12',
    database: 'social_media'

}).promise()

export async function readposts1(){
     const output = await connection.query("select * from posts1")
     return output[0]
}


export async function readpeople(profile){
       const output = await connection.query("select * from people where profile = '"+profile+"'")
       return output[0]
}

export async function insertpeople(name,profile,password,headline){
    const output = await connection.query("insert into people(name,profile,password,headline) value ('"+name+"','"+profile+"','"+password+"','"+headline+"')")
}

export async function insertposts1(profile,content){
    const output = await connection.query("insert into posts1(profile,content,likes,shares) value ('"+profile+"','"+content+"',0,0)")
}

export async function likefun(content){
    const output = await connection.query("select likes from posts1 where content='"+content+"'")
    const likes = output[0] [0].likes
    const inclikes = likes + 1
    await connection.query("update posts1 set likes="+inclikes+" where content='"+content+"'")

}

export async function sharefun(content){
    const output = await connection.query("select shares from posts1 where content='"+content+"'")
    const shares = output[0] [0].shares
    const incshares = shares + 1
    await connection.query("update posts1 set shares="+incshares+" where content='"+content+"'")

}


export async function deletefun(content){
    await connection.query("delete from posts1  where content='"+content+"'")

}