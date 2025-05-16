import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotPedidosComponent } from './bot-pedidos.component';

describe('BotPedidosComponent', () => {
  let component: BotPedidosComponent;
  let fixture: ComponentFixture<BotPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
