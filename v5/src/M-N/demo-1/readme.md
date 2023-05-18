# 标准化表设计

`product`:

| id  | name |
| --- | ---- |


`category`:

| id  | name |
| --- | ---- |


`product_category`:

| id  | product_id | category_id |
| --- | ---------- | ----------- |


尽管这种方法提供了很好的标准化模型，最终的查询操作将会执行很多应用级的"join"操作
