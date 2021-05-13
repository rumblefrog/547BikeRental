

/**
  @file    nfc_p2p_target.ino
  @author  www.elechouse.com
  @brief   example of Peer to Peer communication for NFC_MODULE.

    By this demo, target send "Hi, this message comes from NFC TARGET."
    
  NOTE: this library only support MAX 50 bytes data packet, that is the tx_len must
  less than 50..
  
  @section  HISTORY
  
  V1.0 initial version
  
    Copyright (c) 2012 www.elechouse.com  All right reserved.
*/

/** include library */
#include "nfc.h"
#include <AES.h>
//#include <SoftwareSerial.h>
AESTiny128 tinyAES;

/** define a nfc class */
NFC_Module nfc;

/** define RX and TX buffers, and length variable */
u8 tx_buf[50]="Hi, This message comes from NFC TARGET.";
u8 tx_len;
u8 rx_buf[50];
u8 rx_len;
int state = 0;

uint8_t  key[] = {0xFE,0x4A,0xB7,0x3E,0xE9,0xD4,0xCE,0xE1,0x94,0x6C,0x3C,0xFD,0x87,0x35,0xF7,0xF0};
//SoftwareSerial network = SoftwareSerial(8,9);
void setup(void)
{
  Serial.begin(115200);
  nfc.begin();
  Serial.println("P2P Target Demo From Elechouse!");
  delay(1000);
  unsigned long seed = analogRead(A0)<<20 + analogRead(A1)<<10 + analogRead(A2);
  Serial.println(seed);
  randomSeed(0);
  uint32_t versiondata = nfc.get_version();
  while(! versiondata) {
    Serial.println("Didn't find PN53x board");
    delay(1000); // halt
    versiondata = nfc.get_version();
  }
  //network.begin(9600);
  delay(500);
  
  // Got ok data, print it out!
  //Serial.print("Found chip PN5");// Serial.println((versiondata>>24) & 0xFF, HEX); 
  //Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  //Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);

  
  /** Set normal mode, and disable SAM */
  nfc.SAMConfiguration();
}

void loop(void)
{
  if(nfc.P2PInitiatorInit()){    
    Serial.println("State = " + String(state+1));
    
    //Stage 1, random nonce
    if(state ==0){
      for(int i=0; i<16;i++){
        tx_buf[i] = random(255); 
      }
      tx_buf[16] = 0;
      tx_len=16;    
      }
      
    //Stage 2, acknowledge
    if(state ==1){
      tx_buf[0] = '2';
      tx_buf[1]=0;
      tx_len=1;
    }
    
    //Stage 3, return response from server
    if(state ==2){
      while(!Serial.available()){
        delay(5);
      }
      int i = 0;
      while(Serial.available()){
        tx_buf[i] = Serial.read();
        i++;
      }
      tx_len=i;
      if(tx_len=="bad bike"){
        state == 0;
        return;
      }
      
    }
    
    Serial.println("tx:");
    for(int i=0;i<tx_len;i++){
          if(tx_buf[i]<16) Serial.print("0");
          Serial.print(tx_buf[i],HEX);
        }
    Serial.println();
    //if(nfc.P2PTargetTxRx(tx_buf, tx_len, rx_buf, &rx_len)){
    if(nfc.P2PInitiatorTxRx(tx_buf, tx_len, rx_buf, &rx_len)){
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
      Serial.println("rx:");
      
       for(int i=0;i<rx_len;i++){
          if(rx_buf[i]<16) Serial.print("0");
          Serial.print(rx_buf[i],HEX);
        }
        Serial.println();
        
      if(state == 0 && rx_len==1){
        state = 1;
      }

      //Isolate id, nonce, and encrypted nonce for server
      if(state == 1 && rx_len==36){
        Serial.print("0x");
        for(int i=0;i<4;i++){
          if(rx_buf[i]<16) Serial.print("0");
          Serial.print(rx_buf[i],HEX);
        }
        Serial.println();
        Serial.print("0x");
        for(int i=4;i<20;i++){
          if(rx_buf[i]<16) Serial.print("0");
          Serial.print(rx_buf[i],HEX);
        }
        Serial.println();
        Serial.print("0x");
        for(int i=20;i<36;i++){
          if(rx_buf[i]<16) Serial.print("0");
          Serial.print(rx_buf[i],HEX);
        }
        Serial.println();
        state = 2;
      }
      
      if(state == 2 && rx_len==2){
        state = 0;
      }
     } else{
      Serial.println("Comm Failure");
      delay(5000);
      
    }
    //Serial.println();
    delay(5000);
  }
  //Serial.println("Peer not found");
}
