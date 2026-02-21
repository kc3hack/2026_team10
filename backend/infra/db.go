package infra

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func SetupDB() *gorm.DB {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Step1: DB名を指定せずに接続してデータベースを作成（存在しない場合）
	rootDSN := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Asia%%2FTokyo&tls=skip-verify",
		dbUser, dbPassword, dbHost, dbPort,
	)
	sqlDB, err := sql.Open("mysql", rootDSN)
	if err != nil {
		panic(fmt.Sprintf("Failed to open database connection: %v", err))
	}
	// リトライ（RDSが起動中の場合に備えて）
	for i := 0; i < 10; i++ {
		if err = sqlDB.Ping(); err == nil {
			break
		}
		log.Printf("Waiting for database... (attempt %d/10): %v", i+1, err)
		time.Sleep(3 * time.Second)
	}
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %v", err))
	}
	// DBが存在しない場合は作成
	if _, err = sqlDB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", dbName)); err != nil {
		panic(fmt.Sprintf("Failed to create database: %v", err))
	}
	log.Printf("Database '%s' is ready", dbName)
	sqlDB.Close()

	// Step2: DB名を指定して接続
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FTokyo&tls=skip-verify",
		dbUser, dbPassword, dbHost, dbPort, dbName,
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database '%s': %v", dbName, err))
	}

	// コネクションプール設定（RDS向け推奨）
	gormSqlDB, err := db.DB()
	if err != nil {
		panic(fmt.Sprintf("Failed to get database instance: %v", err))
	}
	gormSqlDB.SetMaxIdleConns(10)
	gormSqlDB.SetMaxOpenConns(100)
	gormSqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Successfully connected to MySQL database (RDS)")

	return db
}
