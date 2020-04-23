import { TestBed, inject } from '@angular/core/testing';

import { CommunicationService } from './communication.service';

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommunicationService]
    });
  });

  it('should be created', inject([CommunicationService], (service: CommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
