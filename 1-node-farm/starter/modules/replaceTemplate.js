module.exports = {
    replaceTemplate,
    test
}

function test()
{
    console.log('test');
}
function replaceTemplate (temp, product) 
{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%PRODUCTIMAGE%}/g, product.image);
    output = output.replace(/{%PRODUCTPRICE%}/g, product.price);
    output = output.replace(/{%PRODUCTFROM%}/g, product.from);
    output = output.replace(/{%PRODUCTNUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%PRODUCTQUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRODUCTDESCRIPTION%}/g, product.description);
    output = output.replace(/{%PRODUCTID%}/g, product.id);

    if (!product.organic)
    {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}
