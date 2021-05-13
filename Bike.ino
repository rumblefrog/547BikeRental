
#include "nfc.h"
#include <AES.h>
//#include <SoftwareSerial.h>

AESTiny128 tinyAES = AESTiny128();
/** define a nfc class */
NFC_Module nfc;
/** define RX and TX buffers, and length variable */
u8 tx_buf[45]="Hi, this message comes from NFC INITIATOR.";
u8 tx_len;
u8 rx_buf[30]="Test";
u8 rx_len;
int state = 0;
/*
uint8_t k1[32];// = {0xFE,0x4A,0xB7,0x3E,0xE9,0xD4,0xCE,0xE1,0x94,0x6C,0x3C,0xFD,0x87,0x35,0xF7,0xF0,0x57,0x44,0x6,0x94,0x8,0x70,0xCE,0xA1,0xFB,0x51,0x0,0x99,0x96,0x1C,0x72,0x3A};
uint8_t k2[32];
uint8_t f1[32];//= {0xD3,0xC7,0xB8,0x87,0x91,0x60,0xFC,0x46,0x68,0xEB,0x6E,0x7F,0x53,0x91,0x93,0x7B,0xCC,0x5,0x5B,0x9B,0x67,0x7,0x25,0x4D,0x37,0xD3,0x47,0x8A,0x19,0x39,0x41,0xBC};
uint8_t f2[32];
*/
uint8_t  key[] = {0xFE,0x4A,0xB7,0x3E,0xE9,0xD4,0xCE,0xE1,0x94,0x6C,0x3C,0xFD,0x87,0x35,0xF7,0xF0};
//uint8_t server_key[] = {0xD3,0xC7,0xB8,0x87,0x91,0x60,0xFC,0x46,0x68,0xEB,0x6E,0x7F,0x53,0x91,0x93,0x7B};
//int id = 0xffffffff;
//SoftwareSerial network = SoftwareSerial(8,9);


void setup(void)
{
  Serial.begin(115200);
  /** nfc initial */
  nfc.begin();
  
  Serial.println("Starting.");
  //network.begin(9600);
  delay(3000);
  uint32_t versiondata = nfc.get_version();
  while(! versiondata) {
    Serial.println("Didn't find PN53x board");
    versiondata = nfc.get_version();
    delay(2000); // halt
  }
  
  Serial.println("Encryption Finished");
  
  nfc.SAMConfiguration();
}

void loop(void)
{
  
  /** device is configured as Initiator */
  
  if(nfc.P2PTargetInit()){
  
    Serial.println("State = " + String(state+1));
    
    /**
      send data with a length parameter and receive some data,
      tx_buf --- data send buffer
      tx_len --- data send legth
      rx_buf --- data recieve buffer, return by P2PInitiatorTxRx
      rx_len --- data receive length, return by P2PInitiatorTxRx
    */

    //Stage 1: ack
    if(state == 0){
      tx_buf[0]= 0x31;
      tx_buf[1]=0;
      tx_len=1;
    }

    //Stage 2: encrypt nonce
    if(state == 1){
      tinyAES.setKey(key,16);
      
      for(int i = 0; i<4;i++){
          tx_buf[i] = 0xff;
      }
      for(int i = 4; i<20;i++){
        tx_buf[i] = rx_buf[i-4];
      }
      tinyAES.encryptBlock(&tx_buf[20],rx_buf);
      tx_buf[36]=0;
      tx_len=36;
    }
    
    //Stage 3: accept server response
    if(state==2){
      tx_buf[0]='2';
      tx_buf[1]=0;
      tx_len=1;
    }
    
    if(nfc.P2PTargetTxRx(tx_buf, tx_len, rx_buf, &rx_len)){
    
    /*
    network.write(tx_buf,tx_len);
    while(!network.available()){
        delay(5);
      }
      int i = 0;
      while(network.available()){
        delay(1);
      rx_buf[i] = network.read();
      i++;
      }
      rx_len=i;*/
      
      Serial.println("tx:");
    for(int i = 0; i<tx_len;i++){
          if(rx_buf[i]<16) Serial.print('0');
          Serial.print(tx_buf[i],HEX);
        }
        Serial.println();
      Serial.println("rx:");
      
      if(state==0){
        //Serial.println(rx_len);
        Serial.print("0x");
        for(int i = 0; i<rx_len;i++){
          if(rx_buf[i]<16) Serial.print('0');
          Serial.print(rx_buf[i],HEX);
          
        }
        Serial.println();
        state=1;
      }
      
      if(state==1&&rx_len==1){
        //Serial.println(rx_len);
        Serial.print("0x");
        for(int i = 0; i<rx_len;i++){
          if(rx_buf[i]<16) Serial.print('0');
          Serial.print(rx_buf[i],HEX);
          
        }
        Serial.println();
        //Serial.println("Comm Success");
        state=2;
      }
      
      if(state==2&&rx_len==32){
        Serial.print("0x");
        for(int i = 0; i<rx_len;i++){
          if(rx_buf[i]<16) Serial.print('0');
          Serial.print(rx_buf[i],HEX);
          
        }
      }
      
      Serial.println();
   } else{
      Serial.println("Comm failure");
      delay(5000);
      
    }
    Serial.println();
    delay(5000);
  }
  //Serial.println("Peer not found");
}
