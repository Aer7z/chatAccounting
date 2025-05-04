export const createSQL = `
CREATE TABLE IF NOT EXISTS BillDetails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 自动递增的 ID
    accountingType TEXT NOT NULL CHECK (accountingType IN ('income', 'expense')),  -- 收/支类型
    category TEXT NOT NULL,  -- 账单分类
    content TEXT NOT NULL,  -- 内容，即购买项、收入项
    description TEXT NOT NULL CHECK (LENGTH(description) <= 32),  -- 账单描述
    productSub TEXT NOT NULL CHECK (LENGTH(productSub) <= 16),  -- 账单的生产主体
    recordDate TEXT NOT NULL,  -- 产生时间，包含日期和具体时间
    totalPrice REAL NOT NULL  -- 价格
)`;

export const insertSQL = `
INSERT INTO BillDetails (
    accountingType,
    category,
    content,
    description,
    productSub,
    recordDate,
    totalPrice
) VALUES (?, ?, ?, ?, ?, ?, ?)`;


export const querySQL = 'SELECT * FROM BillDetails ORDER BY recordDate DESC';


export const deleteAllSQL = `
DELETE FROM BillDetails;
`;

export const deleteTableSQL = `DROP TABLE IF EXISTS BillDetails`

export const createBillTable = (database)=>{
    database.transaction(tx => {
        tx.executeSql(
        createSQL,
        [],
        () => {
//             console.log('账单表创建成功！');
        },
        (tx, error) => {
//             console.error('创建表失败：', error);
        }
    );
});};


export const insertBillDetail = (database, billDetail) => {
    // console.log('插入账单如下: ', billDetail);
    const { accountingType, category, content, description, productSub, recordDate, totalPrice } = billDetail;
console.log(">>>billDetail",billDetail,recordDate.toISOString())
    database.transaction(tx => {
        tx.executeSql(
            insertSQL,
            [accountingType, category, content, description, productSub, recordDate.toISOString(), totalPrice],
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
export const getBillDetails = (database) => {
    return new Promise((resolve, reject) => {
        const bills = [];
        database.transaction(tx => {
            tx.executeSql(querySQL, [], (tx, results) => {
                for (let i = 0; i < results.rows.length; i++) {
//                     console.log('>>>results.rows.item(i).recordDate前',results.rows.item(i).recordDate)
                    results.rows.item(i).recordDate = new Date(results.rows.item(i).recordDate)
//                     console.log('>>>results.rows.item(i).recordDate后',results.rows.item(i).recordDate)
                    bills.push(results.rows.item(i));
//                     console.log('>>>results.rows.item(i)',results.rows.item(i))
                }
                // 根据 recordDate 升序排序
                bills.sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
                // console.log('读取成功：', bills); // 输出账单记录
                resolve(bills); // 返回结果
            }, (error) => {
                reject(error); // 处理错误
            });
        });
    });
};


export const deleteAllRecords = (database) => {
    database.transaction(tx => {
        tx.executeSql(
            deleteAllSQL,
            [],
            () => {
//                 console.log('所有账单记录已成功删除！');
            },
            (tx, error) => {
//                 console.error('删除账单记录失败！', error);
            }
        );
    });
};

export const deleteTable = (database) => {
    database.transaction(tx => {
        tx.executeSql(
            deleteTableSQL,
            [],
            () => {
//                 console.log('表格已成功删除！');
            },
            (tx, error) => {
//                 console.error('删除表格失败！', error);
            }
        );
    });
};
