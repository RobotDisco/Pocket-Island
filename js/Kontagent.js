/*jslint white:true, browser:true, plusplus:true, nomen:true, vars:true */
/*global wooga, KontagentApi */

(function () {
    "use strict";
    var KONTAGENT_API_KEY = 'fac6e85e5563431ea06db108b255f6b3';
    var KONTAGENT_SESSION_INTERVAL = 30 * 1000; //Thirty seconds
    var _instance = null;

    var utils = wooga.castle.utils;
    var Kontagent = function () {
        if (_instance) {
            throw 'Kontagent was already initialized';
        }
        _instance = this;

        this._api_wrapper = new KontagentApi(KONTAGENT_API_KEY, {
            'useTestServer':true,
            'validateParams':true
        });
        this.initializeSubscriptions();
    };

    utils.mixin(Kontagent, utils.PubSubMixin);

    Kontagent.instance = function() {
        return _instance;
    };

    Kontagent.prototype.initializeSubscriptions = function() {
        wooga.castle.Game.instance().subscribe("entity/buy", this.trackPurchase);
        wooga.castle.Game.instance().subscribe("player/level-up", this.trackLevelUp);
        wooga.castle.Game.instance().subscribe("tutorial/done", this.trackTutorialDone);
        wooga.castle.Game.instance().subscribe("enemy/kill", this.trackEnemyKilled);
        wooga.castle.Game.instance().subscribe("contract/start", this.trackContractStarted);
        wooga.castle.Game.instance().subscribe("contract/collect", this.trackContractRewardCollected);
        wooga.castle.Game.instance().subscribe("castle/upgrade", this.trackCastleUpgraded);
        utils.subscribe("game/ready", this.beginTrackingUser);
    };

    Kontagent.prototype.beginTrackingUser = function () {
        // Consider this an app "installation."
        Kontagent.instance()._api_wrapper.trackApplicationAdded(wooga.castle.playerData.kontagent_id, {},
            function() {},
            function(error) {
                window.alert("Could not send APA message for uid " + wooga.castle.playerData.kontagent_id + ": " + error);
            });
        // Once the game starts, we want to regularly send PGR signals to indicate
        // that the user is still playing the game. We use this for session tracking.
        window.setInterval(function () {
            Kontagent.instance()._api_wrapper.trackPageRequest(wooga.castle.playerData.kontagent_id, {},
                function () {
                },
                function (error) {
                    window.alert("Could not send PGR message for uid " + wooga.castle.playerData.kontagent_id + ": " + error);
                });
        }, KONTAGENT_SESSION_INTERVAL);
    };

    Kontagent.prototype.trackPurchase = function(message) {
        Kontagent.instance()._api_wrapper.trackEvent(wooga.castle.playerData.kontagent_id,
            'purchase',
            {
                'subtype1': message.entity.getProperName().replace(/\s/g, '').substring(0,32)
            },
            function () {},
            function(error) {
                window.alert("Could not send purchase EVT due to " + error);
            });
    };

    Kontagent.prototype.trackLevelUp = function(message) {
        Kontagent.instance()._api_wrapper.trackEvent(wooga.castle.playerData.kontagent_id,
            'level_up',
            {
                'level': message.level
            },
            function () {},
            function(error) {
                window.alert("Could not send level-up EVT due to " + error);
            });
    };

    Kontagent.prototype.trackTutorialDone = function() {
        Kontagent.instance()._api_wrapper.trackEvent(wooga.castle.playerData.kontagent_id,
            'tutorial_done',
            {},
            function () {},
            function(error) {
                window.alert("Could not send purchase EVT due to " + error);
            });
    };

    Kontagent.prototype.trackEnemyKilled = function() {
        Kontagent.instance()._api_wrapper.trackEvent(wooga.castle.playerData.kontagent_id,
            'enemy_killed',
            {},
            function () {},
            function(error) {
                window.alert("Could not send tutorial_done EVT due to " + error);
            });
    };

    Kontagent.prototype.trackContractStarted = function(message) {
        Kontagent.instance()._api_wrapper.trackEvent(wooga.castle.playerData.kontagent_id,
            'contract_started',
            {
                'subtype1': message.entity.getProperName().replace(/\s/g, '').substring(0,32)
            },
            function () {},
            function(error) {
                window.alert("Could not send contract_started EVT due to " + error);
            });
    };

    Kontagent.prototype.trackContractRewardCollected = function(message) {
        Kontagent.instance()._api_wrapper.trackEvent(wooga.castle.playerData.kontagent_id,
            'reward_collected',
            {
                'subtype1': message.entity.getProperName().replace(/\s/g, '').substring(0,32)
            },
            function () {},
            function(error) {
                window.alert("Could not send reward_collected EVT due to " + error);
            });
    };

    Kontagent.prototype.trackCastleUpgraded = function(message) {
        Kontagent.instance()._api_wrapper.trackEvent(wooga.castle.playerData.kontagent_id,
            'castle_upgrade',
            {
                'subtype1': message.entity.getProperName().replace(/\s/g, '').substring(0,32)
            },
            function () {},
            function(error) {
                window.alert("Could not send castle_upgrade EVT due to " + error);
            });
    };

    wooga.castle.Kontagent = Kontagent;
}());