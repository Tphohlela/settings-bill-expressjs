const assert = require('assert');
const SettingsBill = require('../settingsBill');

describe('settings-bill', function () {

    const settingsBill = SettingsBill();

    // it('should be able to record calls', function () {
    //     settingsBill.recordAction('call');
    //     assert.equal(1, settingsBill.actionsFor('call').length);
    // });

    it('should be able to set the settings', function () {
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        assert.deepEqual({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        }, settingsBill.getSettings())


    });

    it('should calculate the right totals', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(2.35, settingsBill.totals().smsTotal);
        assert.equal(3.35, settingsBill.totals().callTotal);
        assert.equal(5.70, settingsBill.totals().grandTotal);

    });

    it('should calculate the right totals for multiple actions', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(4.70, settingsBill.totals().smsTotal);
        assert.equal(6.70, settingsBill.totals().callTotal);
        assert.equal(11.40, settingsBill.totals().grandTotal);

    });

    it('should know when warning level reached', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedWarningLevel());
    });

    it('should know when critical level reached', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());

    });

    it('should return danger when critical level has been reached', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal('danger', settingsBill.totalClassNameCritical());

    });

    it('should return warning when warning level has been reached', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal('warning', settingsBill.totalClassNameWarning());

    });

    it('should not exceed critical level', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');

        assert.equal(10, settingsBill.totals().grandTotal);

    });

    it('make sure values get rounded off to two decimal places', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');

        assert.equal(10.00, settingsBill.totals().grandTotal);

    });

    it('make sure values get rounded off to two decimal places', function () {
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.50,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');

        assert.equal(10.50, settingsBill.totals().grandTotal);

    });


    // it('make sure call cost and sms cost values that equal 0, do not get displayed', function () {
    //     const settingsBill = SettingsBill();
    //     settingsBill.setSettings({
    //         smsCost: 5,
    //         callCost: 0,
    //         warningLevel: 5,
    //         criticalLevel: 10
    //     });

    //     settingsBill.recordAction('sms');
    //     settingsBill.recordAction('call');

    //     assert.equal([{
    //         cost: 5,
    //         timestamp: " [Date: 2021-07-28T16:42:37.676Z]"
    //         ,
    //         type: 'sms'
    //     }
    //     ], settingsBill.actions());


    // });
});
