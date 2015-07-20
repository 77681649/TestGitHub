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

    // 定义一个构造函数时，其默认的prototype对象是一个Object类型的实例，
    // 其contructor会被自动生成为该构造函数本身
    // 手动将其prototype设置为另一个对象，新对象的contructor姿容不会具有原对象的contructor值
    // 所以需要重新设置
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