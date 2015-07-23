(function(global) {
    var
        prev = global._,
        _ = global._ = {};

    var breaker = _.breaker = {};

    var isFunction = _.isFunction = function(fn) {
        return fn && typeof fn === 'function';
    };

    var isArray = _.isArray = function(array) {
        return array && Object.prototype.toString.call(array) === '[object Array]';
    };

    var each = _.each = function(object, fn) {
        var ret;

        if (isArray(object)) {
            for (var i = 0, len = object.length; i < len; i++) {
                if (fn(object[i], i, object) === breaker) {
                    break;
                }
            }
        }
    };
})(window || global);

/**
 * @description 模拟接口的类
 * @constructs
 * @param {String} name 接口名
 * @param {Array} method 声明的方法
 */
function Interface(name, methods) {
    this.name = name;
    this.methods = methods;
}

/** 
 * 为类（构造函数）添加一个方法
 * @param  {String}   name 方法名
 * @param  {Function} fn   方法
 * @return {Object} 返回上下文对象，实现链式调用
 */
Function.prototype.method = function(name, fn) {
    this.prototype[methodName] = fn;

    return this;
};

/**
 * @description 判断对象是否实现指定接口
 * @param  {Object}  object 对象
 * @param  {String}  argument[1 .. len] 要检查的接口
 * @return {Boolean} true,全部都实现
 */
Object.isImpInterface = function(object) {
    for (var i = 1, len = argument.length; i < len; i++) {
        var
            interfaceName = argument[i],
            isImp = false;

        if (object.__interfaces) {
            _.each(object.__interfaces, function(interface) {
                if (interfaceName === interface) {
                    isImp = true;
                    return _.breaker;
                }
            });
        }

        // 有一个接口没有实现，就返回false
        if (!isImp) {
            return false;
        }
    }

    return true;
};

/**
 * @description 确保是否实现了接口的所有方法
 * @param  {Object}  object 对象
 * @param  {Object}  argument[1 .. len] 要检查的接口
 */
Object.ensureImplements = function(object) {
    for (var i = 1, len = argument.length; i < len; i++) {
        var
            interface = argument[i];

        if (interface instanceof Interface) {
            _.each(interface.methods, function(methodName) {
                if (!object[methodName] || _.isFunction(object[methodName])) {
                    throw new Error('没有实现接口[' + interface.name + ']的[' + methodName + ']方法');
                }
            });
        }
    }
};

/**
 * @description 原型继承
 * @param  {Function} subClass   子类
 * @param  {Function} superClass 父类
 */
Object.extend = function(subClass, superClass) {
    var
        F = function() {};

    F.prototype = superClass.prototype;

    subClass.prototype = new F();

    // 定义一个构造函数时，默认的prototype对象是一个Object类型的实例
    // 
    // prototype.contructor会被自动生成为该构造函数本身
    // 
    // 如果手动将其prototype设置为另一个对象，
    // 则prototype.contructor会被改为另一个对象的constructor
    // 
    // 所以需要重置一下
    subClass.prototype.constructor = subClass;
};

/**
 * @description 原型继承
 * 创建一个空对象，将该空对象的原型对象设置为sourceObj，以此来达到继承目的
 * @param  {Object} sourceObj 原型对象
 * @return {Object}
 */
Object.clone = function(sourceObj) {
    var
        F = function() {},
        obj;

    F.prototype = sourceObj;

    return new F;
};

/**
 * @description 扩展obj
 * @param  {Object} obj 需要扩展的对象
 * @param  {Object} 1~n 扩展的对象
 */
Object.minix = function(obj) {
    if (!obj) {
        return;
    }

    for (var i = 1; i < argument[i].length; i++) {
        for (var p in arguments[i]) {
            if (arguments[i].hasOwnProperty(p)) {
                obj[p] = arguments[i][p];
            }
        }
    }
};

/**
 * @description 创建类（支持继承）
 * @param {Function} superClass 要继承的类 [可选]
 * @param {Object} propertys  类的成员（属性、方法）
 */
function Class(superClass, propertys) {
    var
        parent;

    if (arguments.length == 0 || arguments.length > 2) {
        throw new Error('argument error.');
    }

    if (superClass && typeof argument === 'function') {
        parent = superClass;
    } else {
        propertys = superClass;
    }

    propertys || (propertys = {});

    function kclass() {
        this.__propertys__();
        this.initialize.apply(this , argument);
    }

    kclass.__superclass = parent;
    kclass.__subclass = [];



    if(parent){
        var midClass = function (){};
        midClass.prototype = parent.prototype;
        kclass.prototype = new midClass;
        kclass.prototype.constructor = kclass;

        parent.__subclass.push(kclass);
    }

    
    for(var name in propertys){
        var
            property = propertys[name];


        // 绑定到原型上
        kclass.prototype[name] = property;
    }


    var
        superInitPropertys = function(){},
        selfInitPropertys = propertys.__propertys__ || function(){};

    parent && parent.__propertys__ && (superInitPropertys = parent.__propertys__);

    kclass.prototype.__propertys__ = function(){
        superInitPropertys.call(this);
        selfInitPropertys.call(this);
    };

    kclass.prototype.initialize || (kclass.prototype.initialize = function(){});

    return kclass;
}