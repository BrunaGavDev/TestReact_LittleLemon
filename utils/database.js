import * as SQLite from 'expo-sqlite';

let db =   SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
  //await db.execAsync(`drop table menuitems;`); 
  await db.execAsync(`create table if not exists menuitems (id integer primary key not null, name text, price text, description text, image text, category text);`); 
  
} 

export async function getMenuItems() {
  
   const allRows = await db.getAllAsync('SELECT * FROM menuitems');
   console.log(allRows);
  return allRows;
}

export async function  saveMenuItems(menuItems) {
   menuItems.map( async (item) => {
          try
          {
             let insertcmd = `insert into menuitems (id, name, price, description, image, category) values
                  ( ${item.id}, "${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`; 
             console.log(insertcmd);            
            const result = await db.runAsync(insertcmd);
            console.log(result.lastInsertRowId, result.changes);
         }
         catch (e) {
             console.error(e);
        }
     });
 
}


export async function filterByQueryAndCategories(query, activeCategories) {
  console.log ('filter' + query);
  console.log(activeCategories);
  const result = await db.getAllAsync(
        `select * from menuitems where name like ? and category in ('${activeCategories.join(
          "','"
        )}')`,
        [`%${query}%`]);
  console.log (result);
  return result;
}
