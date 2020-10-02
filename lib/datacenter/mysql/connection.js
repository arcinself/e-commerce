const {to} = require('await-to-js');
const {Sequelize,DataTypes} = require('sequelize');
const logger = require('../../logger/winston');

const connection = new Sequelize(
    'ecommerce',
    'root',
    'Redbottle@321',
    {
        host : 'localhost',
        dialect : 'mysql',
        logging : msg => logger.info(msg)
    }
);


const categoryModel = connection.define('categories', {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        notNull: true
    }
});


const customerModel = connection.define('customers', {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        notNull: true
    },
    email: {
        type: DataTypes.STRING,
        notNull: true
    },
    phone: {
        type: DataTypes.BIGINT,
        notNull: true
    },
    address: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    creditCardNumber: {
        type: DataTypes.BIGINT,
        defaultValue: null
    },
    encryptedPassword: {
        type: DataTypes.STRING,
        notNull: true
    }
});


const productModel = connection.define('products', {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        notNull: true
    },
    details: {
        type: DataTypes.STRING,
        notNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: categoryModel,
            key: 'id'
        }
    }
});


const cartItemModel = connection.define('shoppingCarts', {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: customerModel,
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: productModel,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
});


const attributeModel = connection.define('attributes', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        notNull: true
    },
    value: {
        type: DataTypes.STRING,
        notNull: true
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: productModel,
            key: 'id'
        }
    }
});


const orderModel = connection.define('orders', {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: customerModel,
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: productModel,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
});


const reviewModel = connection.define('reviews', {

    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    review: {
        type: DataTypes.STRING,
        notNull: true
    },
    product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: productModel,
            key: 'id'
        }
    }
});


const connect = async() => {
    let [err, result] = await to(connection.sync({alter:true}));
    if (err){
        logger.error(err.message);
        return;
    }
    console.log(`Successfully connected to the database.`);
    logger.info(`Successfully connected to the database.`);
}

module.exports = {
    connect, attributeModel, categoryModel, cartItemModel, customerModel, orderModel, productModel, reviewModel
}