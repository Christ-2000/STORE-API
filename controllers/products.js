const product = require('../models/product')

const getAllProductsStatic = async (req, res) => {

    // const search = 'ab'
    const products = await product.find({ price: { $gt: 30 } })

        .sort('name')
        .select('name price');
    
    //  name: { $regex: search, $options: 'i' }

    res.status(200).json({ products, nbHits: products.length })
};

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }



    if (numericFilters) {
        const opertorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        };

        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx,
             (match) => `-${opertorMap[match]}-`);
        console.log(filters)
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((items) => {
            const [field, operator, value] = items.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }

        });

    }

    
    let result = product.find(queryObject);
    
    //sort
    if (sort) {
        sortList = result.split(',').join('');
        result = result.sort(sortList);
    } else {
        result = result.sort('createAt');
    }

    if (fields) {
        const fieldsList = field.split(',').join('')
        result = result.select(fieldsList)
    }

    // console.log(queryObject)
    // const products = await product.find(res.query)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);
    //23
    //4 7 7 72
    // console.log('before database')
   
    
    const products = await result;
    // console.log('after database')
    res.status(200).json({ products, nbHits: products.length })
}


module.exports = {
    getAllProducts,
    getAllProductsStatic,
}