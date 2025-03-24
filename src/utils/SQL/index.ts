export const createSQL = `
CREATE TABLE IF NOT EXISTS BillDetails (
    id Number PRIMARY KEY,  -- 账单UUID，使用TEXT类型
    description TEXT NOT NULL,  -- 账单描述
    content TEXT NOT NULL,  -- 内容
    totalPrice TEXT NOT NULL,  -- 价格
    recordDay TEXT NOT NULL,  -- 产生时间（天）
    recordHourMinSec TEXT NOT NULL,  -- 产生时间（小时分钟秒）
    recordWeekDay TEXT  NOT NULL,  -- 星期几
    accountingType TEXT  NOT NULL  -- 收/支类型
);`;

export const insertSQL = `
INSERT INTO BillDetails (
    description,
    content,
    totalPrice,
    recordDay,
    recordHourMinSec,
    recordWeekDay,
    accountingType
) VALUES (?, ?, ?, ?, ?, ?, ?)`;

export const querySQL = 'SELECT * FROM BillDetails ORDER BY recordDay DESC';


export const deleteAllSQL = `
DELETE FROM BillDetails;
`;

export const createBillTable = (database)=>{
    database.transaction(tx => {
        tx.executeSql(
        createSQL,
        [],
        () => {
            console.log('账单表创建成功！');
        },
        (tx, error) => {
            console.error('创建表失败：', error);
        }
    );
});};


export const insertBillDetail = (database, billDetail) => {
//     console.log('账单如下: ', billDetail);
    const { description, content, totalPrice, recordDay, recordHourMinSec, recordWeekDay, accountingType } = billDetail;

    database.transaction(tx => {
        tx.executeSql(
            insertSQL,
            [description, content, totalPrice, recordDay, recordHourMinSec, recordWeekDay, accountingType],
            () => {
                console.log('账单插入数据表顺利！');
            },
            (tx, error) => {
                console.error('账单插入数据表失败！', tx, error);
            }
        );
    });
};

       // 读取数据
export  const getBillDetails = (database) => {
    const bills = [];
    database.transaction(tx => {
        tx.executeSql(querySQL, [], (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
                bills.push(results.rows.item(i));
            }
            console.log('读取成功：',bills); // 输出账单记录
        });
    });
    return bills;
};


export const deleteAllRecords = (database) => {
    database.transaction(tx => {
        tx.executeSql(
            deleteAllSQL,
            [],
            () => {
                console.log('所有账单记录已成功删除！');
            },
            (tx, error) => {
                console.error('删除账单记录失败！', error);
            }
        );
    });
};
