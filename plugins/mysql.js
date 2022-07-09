const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const yaml = require('js-yaml');
const fs   = require('fs');
const path   = require('path');
const setttings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));

const sequelize = new Sequelize(setttings.db_database, setttings.db_username, setttings.db_password, {
    host: setttings.db_server,
    port: setttings.db_port,
    dialect: setttings.db_dialect,
    logging: false,
    storage: setttings.db_storage
  });
const queryInterface = sequelize.getQueryInterface();
sequelize.authenticate().then(() => {
    console.log('Подключение к DataBase.');
}).catch(err => {
    console.log(`Ошибка database:\nCode: ${err.parent.code}\nMessage: ${err.parent.sqlMessage}`);
    process.exit(1);
});
//Модели бд
const User = sequelize.define('RWRcon_User', {
    pref: {
    type: DataTypes.STRING,
    allowNull: false
    },
    level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
    },
    ban: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
    },
    vkid: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    ablc: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const Rcon_Report = sequelize.define('RWRcon_Report', {
    sender: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    messages: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const BlockCmd = sequelize.define('RWRcon_BlocklistCmd', {
    cmd: {
    type: DataTypes.STRING,
    allowNull: false
    },    
    server: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const AllowCmd = sequelize.define('RWRcon_WhitelistCmd', {
    cmd: {
    type: DataTypes.STRING,
    allowNull: false
    },    
    server: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const BlackCmd = sequelize.define('RWRcon_BlacklistCmd', {
    cmd: {
    type: DataTypes.STRING,
    allowNull: false
    },    
    server: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const Rcon_Data = sequelize.define('RWRcon_Data', {
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    ip: {
    type: DataTypes.STRING,
    allowNull: false
    },
    rcon_port: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    rcon_password: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const Rcon_Stats = sequelize.define('RWRcon_Stats', {
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    player: {
    type: DataTypes.STRING,
    allowNull: false
    },
    ping: {
    type: DataTypes.STRING,
    allowNull: false
    },
    status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
    },
    monitors: {
    type: DataTypes.BOOLEAN,
    allowNull: false
    },
    ip: {
    type: DataTypes.STRING,
    allowNull: false
    },
    port: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    widgets_icon: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'id359430019'
    },
    widgets_url: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'vk.com/rimworlda'
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const Rcon_Level = sequelize.define('RWRcon_Level', {
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    id_name: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
const Rcon_Prefix = sequelize.define('RWRcon_Prefix', {
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    prefix: {
    type: DataTypes.STRING,
    allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
if(setttings.install == false) {
User.sync({force: true});
Rcon_Report.sync({force: true});
BlockCmd.sync({force: true});
AllowCmd.sync({force: true});
Rcon_Data.sync({force: true});
Rcon_Stats.sync({force: true});
Rcon_Level.sync({force: true});
Rcon_Prefix.sync({force: true});
BlackCmd.sync({force: true});
};
module.exports = {BlackCmd,Sequelize,QueryTypes,DataTypes,sequelize,queryInterface,User,Rcon_Report,BlockCmd,AllowCmd,Rcon_Data,Rcon_Stats,Rcon_Level,Rcon_Prefix}