import * as SQLite from 'expo-sqlite';

let db =   SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
  
  await db.execAsync(`
create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);
`); 
  
} 

export async function getMenuItems() {
  
   const allRows = await db.getAllAsync('SELECT * FROM menuitems');
  return allRows;
}

export async function  saveMenuItems(menuItems) {
   menuItems.map( async (item) => {
          try
          {
             let insertcmd = `insert into menuitems (uuid, title, price, category) values ( '${item.id}', '${item.title}', '${item.price}', '${item.category.title}')`; 
            //  console.log(insertcmd);            
            const result = await db.runAsync(insertcmd);
            //console.log(result.lastInsertRowId, result.changes);
         }
         catch (e) {
             console.error(e);
        }
     });
 
}


export async function filterByQueryAndCategories(query, activeCategories) {
  console.log ('filter');
  const result = await db.getAllAsync(
        `select * from menuitems where title like ? and category in ('${activeCategories.join(
          "','"
        )}')`,
        [`%${query}%`]);
  console.log (result);
  return result;
}
