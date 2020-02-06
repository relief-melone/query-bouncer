import { expect } from 'chai';
import validatePayloadAgainstRestrictions from '../src/services/queries/service.validatePayloadAgainstRestrictions';

describe.only('service.validatePayloadAgainstRestrictions', () => {
  it('will throw if the payload does only match a combination of restrictions', () => {
    // Prepare
    const payload = {
      Title : 'Something',
      SomeReferenceId: '12345',
    };
    const restrictions = [
      { SomeReferenceId: '12345', Title:'SomethingElse' },
      { SomeReferenceId: '45678', Title:'Something' },
    ];

    // Execute
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();
  });
  it('will not throw if a restriction doesnt define a field, so this field not restricted if other conditions of that restriction are met', () => {
    // Prepare
    const payload = {
      Title : 'Something',
      SomeReferenceId: '12345',
    };
    const restrictions = [
      { SomeReferenceId: '12345', Title:'SomethingElse' },
      { SomeReferenceId: '12345' },
    ];

    // Execute
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).not.to.throw();
  });
  it('will not throw if the payload matches the restrictions', () => {
    // Prepare
    const payload = {
      Title : 'Something',
      SomeReferenceId: '12345',
    };
    const restrictions = [
      { SomeReferenceId: '12345' },
      { SomeReferenceId: '987654' }
    ];

    // Execute
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).not.to.throw();
  });

  it('will throw if the payload does not match the restriction', () => {
    // Prepare
    const payload = {
      Title : 'Something',
      SomeReferenceId: '11111',
    };
    const restrictions = [
      { SomeReferenceId: '12345' },
    ];
    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();
  });
  it('will throw if the payload doesnt contain restricted keys', () => {
    // Prepare
    const payload = {
      Title : 'Something',
      SomeReferenceId: '11111',
    };
    const restrictions = [
      { FieldNotInPayload: '12345' },
    ];
    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();
  });

  it('will not throw if nested payload matches the restrictions', () => {
    // Prepare
    const payload = {
      Title: 'Hello',
      Assets: {
        Foo: 'Bar',
      },
    };

    const restrictions = [
      { Assets: { Foo: 'Bar' } },
      { Assets: { Bar: 'Foo' } },
    ];

    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).not.to.throw();
  });

  it('will throw if nested payload does not match the restrictions', () => {
    // Prepare
    const payload = {
      Title: 'Hello',
      Assets: {
        Foo: 'Bar',
      },
    };

    const restrictions = [
      { Assets: { Foo: 'Ba' } },
      { Assets: { Bar: 'Foo' } },
    ];

    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();
  });

  it('will not throw a nested payload with primitive arrays that match the restrictions', () => {
    // Prepare
    const payload = {
      Title: 'Hello',
      Assets: ['Foo', 'Bar'],
    };

    const restrictions = [
      { Assets: ['Foo', 'Bar', 'Boo'] },
    ];

    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).not.to.throw();
  });

  it('will throw with a nested payload with primitive arrays that do not match the restrictions', () => {
    // Prepare
    const payload = {
      Title: 'Hello',
      Assets: ['Foo', 'Wrong'],
    };

    const restrictions = [
      { Assets: ['Foo', 'Bar', 'Boo'] },
    ];

    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();
  });

  it('will not throw with a nested payload with object arrays that do match the resctrictions', () => {
    // Prepare
    const payload = {
      Title: 'Hello',
      Assets: [
        { Bar: 'Foo',Clue: 'Less', Not: 'restricted' }, 
        { Bar: 'Too' },
        { Zoo: 'Bam' }
      ]
    };

    const restrictions = [
      { Assets: [
        { Zoo: 'Bam' },
        { Bar: 'Foo', Clue: 'Less' }, 
        { Bar: 'Too' }
      ] },
    ];

    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).not.to.throw();
  });

  it('will throw with a nested payload with object arrays that do not match the restrictions', () => {
    // Prepare
    const payload = {
      Title: 'Hello',
      Assets: [
        { Bar: 'Foo', Zoo: 'Thing' }
      ],
    };

    const restrictions = [
      { Assets: [
        { Bar: 'Foo', Zoo: 'Bam' }, 
        { Bar: 'too' }, 
        { Zoo: 'Tang' }
      ] },
    ];

    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();
  });

  it('restriction in deeper layer will of structure will not effect upper layers', () => {
    const payload = {
      Title: 'Hello',
      Bar: 'Foo',
      DeeperLayer : {
        Some: 'Thing'
      }
    };
  
    const restrictions = [{
      Bar: 'SomethingElse',
      DeeperLayer: {
        Bar: 'Foo'
      }
    }];
  
    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();      
  });

  it('restriction in upper layer will not enable values in deeper layer to pass', () => {
    const payload = {
      Title: 'Hello',
      Bar: 'Foo',
      DeeperLayer : {
        Some: 'Thing',
        Bar: 'Doh'
      }
    };
  
    const restrictions = [{
      Bar: 'Foo',
      DeeperLayer: {
        Bar: 'Foo'
      }
    }];
  
    // Execute/Assert
    expect(() => {validatePayloadAgainstRestrictions(payload, restrictions); }).to.throw();      
  });
});
